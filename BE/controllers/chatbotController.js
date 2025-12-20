const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chatbot = require('../models/Chatbot');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Discount = require('../models/Discount');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache context
let cachedContext = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000;

// Rate limiting counter
let requestCount = 0;
let resetTime = Date.now() + 60000; // Reset mỗi phút

const checkRateLimit = () => {
    const now = Date.now();
    if (now > resetTime) {
        requestCount = 0;
        resetTime = now + 60000;
    }
    return requestCount < 10; // Giới hạn 10 requests/phút
};

const getRestaurantContext = async () => {
    const now = Date.now();
    if (cachedContext && (now - cacheTimestamp) < CACHE_DURATION) return cachedContext;

    const menuUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const menuItems = await MenuItem.find({}, 'name price discountPercent info category').lean();
    const categories = await Category.find({}, 'name').lean();
    const discounts = await Discount.find({}, 'code discountPercent maxDiscount description').lean();

    const catMap = new Map(categories.map(c => [String(c._id), c.name]));

    const menuText = menuItems.slice(0, 30).map(item => {
        const catName = catMap.get(String(item.category)) || 'Khác';
        const discountText = item.discountPercent > 0 ? ` (Giảm ${item.discountPercent}%)` : '';
        return `- ${item.name}: ${item.price}đ${discountText} [${catName}]`;
    }).join('\n');

    const discountText = discounts.length
        ? discounts.map(d => `- ${d.code}: Giảm ${d.discountPercent}%`).join('\n')
        : '(Chưa có mã giảm giá)';

    cachedContext = `
Bạn là chatbot nhà hàng BK Restaurant.

QUY TẮC:
- CHỈ dùng dữ liệu bên dưới
- KHÔNG bịa giá/món/mã
- TRẢ LỜI NGẮN (3-5 món)
- LUÔN kèm link: ${menuUrl}/menu

MENU:
${menuText}

MÃ GIẢM GIÁ:
${discountText}

KẾT THÚC bằng link menu!
`;

    cacheTimestamp = now;
    return cachedContext;
};

// Rule-based fallback khi hết quota
const getRuleBasedResponse = async (message) => {
    const msg = message.toLowerCase();
    const menuUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (msg.match(/món|menu|ăn gì/)) {
        const items = await MenuItem.find({ discountPercent: { $gt: 0 } }).limit(5);
        if (items.length > 0) {
            return `🍽️ Món đang giảm giá:\n\n${items.map(i =>
                `• ${i.name} - ${i.price}đ (Giảm ${i.discountPercent}%)`
            ).join('\n')}\n\n🔗 Xem thêm: ${menuUrl}/menu`;
        }
        const allItems = await MenuItem.find().limit(5);
        return `🍽️ Gợi ý món:\n\n${allItems.map(i =>
            `• ${i.name} - ${i.price}đ`
        ).join('\n')}\n\n🔗 Xem thêm: ${menuUrl}/menu`;
    }

    if (msg.match(/giảm giá|khuyến mãi|voucher/)) {
        const discounts = await Discount.find().limit(3);
        if (discounts.length > 0) {
            return `🎁 Mã giảm giá:\n\n${discounts.map(d =>
                `• ${d.code}: Giảm ${d.discountPercent}%`
            ).join('\n')}\n\n🔗 Xem chi tiết: ${menuUrl}/menu`;
        }
        return 'Hiện tại chưa có mã giảm giá.';
    }

    if (msg.match(/đặt bàn|booking/)) {
        return `📞 Đặt bàn:\n\n1. Vào trang Đặt Bàn\n2. Chọn số người & thời gian\n3. Xác nhận\n\n🔗 ${menuUrl}/book`;
    }

    return `👋 Xin chào! Tôi có thể giúp:\n\n• Gợi ý món (gõ "món")\n• Mã giảm giá (gõ "khuyến mãi")\n• Đặt bàn (gõ "đặt bàn")\n\n😊`;
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

        let botResponse;

        // Kiểm tra rate limit
        if (!checkRateLimit()) {
            console.log('⚠️ Rate limit reached, using rule-based fallback');
            botResponse = await getRuleBasedResponse(message);
        } else {
            try {
                requestCount++;

                const restaurantContext = await getRestaurantContext();
                const recentMessages = chatSession.messages.slice(-10);

                const model = genAI.getGenerativeModel({
                    model: process.env.AI_MODEL || 'gemini-1.5-flash'
                });

                const chat = model.startChat({
                    history: [
                        {
                            role: 'user',
                            parts: [{ text: restaurantContext }]
                        },
                        {
                            role: 'model',
                            parts: [{ text: 'Đã hiểu. Tôi sẽ gợi ý ngắn gọn và thêm link.' }]
                        },
                        ...recentMessages.map(msg => ({
                            role: msg.role,
                            parts: [{ text: msg.content }]
                        }))
                    ],
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.8,
                    }
                });

                const result = await chat.sendMessage(message);
                botResponse = result.response.text();

            } catch (aiError) {
                console.error('AI Error, fallback to rule-based:', aiError.message);
                botResponse = await getRuleBasedResponse(message);
            }
        }

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

exports.clearCache = () => {
    cachedContext = null;
    cacheTimestamp = 0;
};