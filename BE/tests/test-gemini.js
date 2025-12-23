require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

(async () => {
    try {
        const key = process.env.GEMINI_API_KEY;
        const modelName = process.env.AI_MODEL || 'gemini-2.5-flash';
        console.log('🔑 API Key:', key ? 'Có' : 'Không');
        console.log('🧪 Testing với', modelName);

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Xin chào, bạn là ai? Trả lời 1 câu.');
        console.log('✅ OK:', result.response.text());
    } catch (e) {
        console.error('❌ LỖI:', e?.message || e);
        process.exit(1);
    }
})();
