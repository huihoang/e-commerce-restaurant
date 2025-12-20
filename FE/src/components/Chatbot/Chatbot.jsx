import { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { BsChatDots } from 'react-icons/bs';
import { IoClose, IoSend } from 'react-icons/io5';
import { FiExternalLink } from 'react-icons/fi';
import { MdRestaurantMenu, MdLocalOffer } from 'react-icons/md';
import { BiDish } from 'react-icons/bi';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load lịch sử chat khi mở
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        try {
            const { data } = await axios.get(`/api/chatbot/history/${sessionId}`);
            if (data.messages && data.messages.length > 0) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Lỗi load history:', error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post('/api/chatbot/chat', {
                message: input,
                sessionId,
                userId: localStorage.getItem('userId') || null
            });

            setMessages(prev => [...prev, {
                role: 'model',
                content: data.response
            }]);
        } catch (error) {
            console.error('Chat error:', error);

            let errorMsg = 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!';

            if (error.response?.status === 429) {
                errorMsg = '⏳ Hệ thống đang quá tải, vui lòng thử lại sau 1 phút.';
            }

            setMessages(prev => [...prev, {
                role: 'model',
                content: errorMsg
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const renderMessage = (content) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(urlRegex);

        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 underline font-semibold transition-colors"
                    >
                        Xem thêm tại đây <FiExternalLink className="inline" />
                    </a>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    const quickQuestions = [
        { icon: <BiDish className="text-xl sm:text-2xl" />, text: 'Có món gì ngon?' },
        { icon: <MdLocalOffer className="text-xl sm:text-2xl" />, text: 'Khuyến mãi hôm nay?' },
        { icon: <MdRestaurantMenu className="text-xl sm:text-2xl" />, text: 'Xem menu' },
    ];

    return (
        <>
            {/* Floating Button - Responsive */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-indigo-400/50 transition-all duration-300 z-40 hover:scale-110 group"
                aria-label="Mở chatbot"
            >
                {isOpen ? (
                    <IoClose className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:rotate-90" />
                ) : (
                    <BsChatDots className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
                )}
            </button>

            {/* Chat Window - Responsive fullscreen trên mobile */}
            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:left-8 sm:w-[420px] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 chatbot-slideup sm:border sm:border-gray-100 mt-16 sm:mt-0">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 sm:rounded-t-2xl">
                        <div className="flex justify-between items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-PlayfairD text-xl sm:text-2xl font-bold mb-1 truncate">
                                    BK Restaurant
                                </h3>
                                <div className="flex items-center gap-2 font-DM_sans text-xs sm:text-sm text-indigo-50">
                                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                                    <span>Trợ lý ảo sẵn sàng hỗ trợ</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 rounded-full p-2.5 transition-all flex-shrink-0"
                                aria-label="Đóng chatbot"
                            >
                                <IoClose className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-indigo-50/30 to-white hide-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center mt-4 sm:mt-8 px-4">
                                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🍽️</div>
                                <h4 className="font-PlayfairD text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                                    Xin chào!
                                </h4>
                                <p className="font-DM_sans text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                    Tôi có thể giúp bạn tìm món ngon, kiểm tra khuyến mãi và tư vấn đặt bàn
                                </p>

                                {/* Quick Actions */}
                                <div className="space-y-2">
                                    {quickQuestions.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setInput(q.text);
                                                setTimeout(() => sendMessage(), 100);
                                            }}
                                            className="w-full bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl p-2.5 sm:p-3 text-left transition-all hover:shadow-md font-DM_sans text-sm sm:text-base text-gray-700 hover:text-indigo-700 flex items-center gap-2 sm:gap-3"
                                        >
                                            <span className="text-indigo-500">{q.icon}</span>
                                            <span className="font-medium">{q.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl font-DM_sans text-sm sm:text-base whitespace-pre-line ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-md shadow-lg'
                                        : 'bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-100'
                                        }`}
                                >
                                    {msg.role === 'model' ? (
                                        <div className="leading-relaxed">
                                            {renderMessage(msg.content)}
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 sm:p-4 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 pb-6 sm:p-5 border-t border-gray-100 bg-white sm:rounded-b-2xl">
                        <div className="flex gap-2 sm:gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-DM_sans"
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-300/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <IoSend className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-2 font-DM_sans text-center">
                            Nhấn Enter để gửi • Shift + Enter để xuống dòng
                        </p>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    .chatbot-slideup {
        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
`}} />
        </>
    );
};

export default Chatbot;