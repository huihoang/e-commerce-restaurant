const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chatbot = require('../models/Chatbot');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Discount = require('../models/Discount');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache context để tránh query DB liên tục
let cachedContext = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000;

const getRestaurantContext = async () => {
    const now = Date.now();
    if (cachedContext && (now - cacheTimestamp) < CACHE_DURATION) return cachedContext;

    const menuUrl = process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/menu`
        : 'http://localhost:5173/menu';

    const menuItems = await MenuItem.find({}, 'name price discountPercent info category').lean();
    const categories = await Category.find({}, 'name').lean();
    const discounts = await Discount.find({}, 'code discountPercent maxDiscount description').lean();

    const catMap = new Map(categories.map(c => [String(c._id), c.name]));

    const menuText = menuItems.slice(0, 30).map(item => {
        const catName = catMap.get(String(item.category)) || 'Khác';
        const discountText = item.discountPercent > 0 ? ` (Giảm ${item.discountPercent}%)` : '';
        const infoText = item.info ? ` - ${item.info}` : '';
        return `- ${item.name}: ${item.price}đ${discountText}${infoText} [Danh mục: ${catName}]`;
    }).join('\n');

    const catText = categories.map(c => `- ${c.name}`).join('\n');

    const discountText = discounts.length
        ? discounts.map(d => `- ${d.code}: Giảm ${d.discountPercent}% (Tối đa ${d.maxDiscount}đ)${d.description ? ` - ${d.description}` : ''}`).join('\n')
        : '(Hiện chưa có mã giảm giá)';

    cachedContext = `
[BK RESTAURANT CONTEXT - KHÔNG TRẢ LỜI LẠI PHẦN NÀY]

QUY TẮC:
- Chỉ dùng dữ liệu trong CONTEXT để trả lời về món/giá/khuyến mãi.
- Không bịa món, không bịa giá, không tạo mã giảm giá.
- Nếu không có dữ liệu: nói "Hiện tại chưa có thông tin đó trên hệ thống" hoặc "Hiện tại không có món này".

MENU (hiển thị mẫu 30 món):
${menuText || '(Chưa có dữ liệu menu)'}

DANH MỤC:
${catText || '(Chưa có danh mục)'}

MÃ GIẢM GIÁ:
${discountText}

HƯỚNG DẪN TRẢ LỜI:
- Chỉ gợi ý 3–5 món phù hợp nhất.
- Luôn kèm link menu để xem thêm: ${menuUrl}
`;

    cacheTimestamp = now;
    return cachedContext;
};




exports.chat = async (req, res) => {
    try {
        const { message, sessionId, userId } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: 'Tin nhắn không được để trống' });
        }

        let chatSession = await Chatbot.findOne({ sessionId, isActive: true });
        if (!chatSession) {
            chatSession = new Chatbot({
                userId,
                sessionId,
                messages: [],
                isActive: true
            });
        }

        const restaurantContext = await getRestaurantContext();

        const recentMessages = chatSession.messages.slice(-10);

        const model = genAI.getGenerativeModel({
            model: process.env.AI_MODEL || 'gemini-1.5-flash-8b'
        });

        // Tạo chat với history giới hạn
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: restaurantContext }]
                },
                {
                    role: 'model',
                    parts: [{ text: 'Tôi đã hiểu. Tôi sẽ chỉ gợi ý 3-5 món và luôn thêm link để khách xem thêm.' }]
                },
                ...recentMessages.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.7,
            }
        });

        // Gửi tin nhắn
        const result = await chat.sendMessage(message);
        let botResponse = result.response.text();


        chatSession.messages.push(
            { role: 'user', content: message },
            { role: 'model', content: botResponse }
        );

        if (chatSession.messages.length > 50) {
            chatSession.messages = chatSession.messages.slice(-50);
        }

        await chatSession.save();

        res.json({
            response: botResponse,
            sessionId: chatSession.sessionId
        });

    } catch (error) {
        console.error('Chatbot error:', error);

        if (error.message && error.message.includes('429')) {
            return res.status(429).json({
                error: 'Hệ thống đang quá tải, vui lòng thử lại sau 1 phút',
                retryAfter: 60
            });
        }

        res.status(500).json({
            error: 'Lỗi chatbot',
            details: error.message
        });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const chat = await Chatbot.findOne({ sessionId });
        res.json({ messages: chat?.messages || [] });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi lấy lịch sử' });
    }
};

exports.endSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        await Chatbot.updateOne({ sessionId }, { isActive: false });
        res.json({ message: 'Đã kết thúc phiên chat' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi kết thúc session' });
    }
};

// Clear cache khi cần (gọi khi update menu/discount)
exports.clearCache = () => {
    cachedContext = null;
    cacheTimestamp = 0;
};