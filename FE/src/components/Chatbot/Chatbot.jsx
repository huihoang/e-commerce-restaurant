import { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { BsChatDots } from 'react-icons/bs';
import { IoClose, IoSend } from 'react-icons/io5';
import { FiExternalLink } from 'react-icons/fi';

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
        { icon: '🍽️', text: 'Có món gì ngon?' },
        { icon: '🎁', text: 'Khuyến mãi hôm nay?' },
        { icon: '📋', text: 'Xem menu' },
    ];

    return (
        <>
            {/* Floating Button - Màu xanh lá, đặt bên trái để tránh nút back-to-top */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 left-8 bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-indigo-400/50 transition-all duration-300 z-40 hover:scale-110 group"
                aria-label="Mở chatbot"
            >
                {isOpen ? (
                    <IoClose className="w-7 h-7 transition-transform group-hover:rotate-90" />
                ) : (
                    <BsChatDots className="w-7 h-7 animate-pulse" />
                )}
            </button>

            {/* Chat Window - Đặt bên trái */}
            {isOpen && (
                <div className="fixed bottom-28 left-8 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-40 animate-slideUp border border-gray-100">

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-PlayfairD text-2xl font-bold mb-1">
                                    BK Restaurant
                                </h3>
                                <div className="flex items-center gap-2 font-DM_sans text-sm text-indigo-50">
                                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                                    <span>Trợ lý ảo sẵn sàng hỗ trợ</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                                aria-label="Đóng chatbot"
                            >
                                <IoClose className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-indigo-50/30 to-white hide-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center mt-8 px-4">
                                <div className="text-6xl mb-4">🍽️</div>
                                <h4 className="font-PlayfairD text-2xl font-bold text-gray-800 mb-2">
                                    Xin chào!
                                </h4>
                                <p className="font-DM_sans text-gray-600 mb-6">
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
                                            className="w-full bg-white hover:bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-left transition-all hover:shadow-md font-DM_sans text-gray-700 hover:text-indigo-700 flex items-center gap-3"
                                        >
                                            <span className="text-2xl">{q.icon}</span>
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
                                    className={`max-w-[85%] p-4 rounded-2xl font-DM_sans whitespace-pre-line ${msg.role === 'user'
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
                                <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2.5 h-2.5 bg-bllue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-5 border-t border-gray-100 bg-white rounded-b-2xl">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn của bạn..."
                                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-DM_sans"
                                disabled={loading}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-300/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                <IoSend className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-DM_sans text-center">
                            Nhấn Enter để gửi • Shift + Enter để xuống dòng
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
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
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    );
};

export default Chatbot;