const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sessionId: {
        type: String,
        require: true

    },
    messages: [{
        role: { type: String, enum: ['user', 'model'], require: true },
        content: { type: String, require: true },
        timestamp: { type: Date, default: Date.now }
    }],
    context: {
        suggestedDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
        currentCategory: String,
        priceRange: { min: Number, max: Number }
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })
module.exports = mongoose.model('Chatbot', chatbotSchema);