import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';
import dotenv from 'dotenv';

dotenv.config();

let genAI;
let model;

console.log('🔑 API Key Loaded:', process.env.GEMINI_API_KEY ? 'YES (Starts with ' + process.env.GEMINI_API_KEY.substring(0, 4) + ')' : 'NO');

const initAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is missing via process.env!');
        // Fallback check for system environment
        return false;
    }
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log('✨ AI Model initialized successfully');
        return true;
    } catch (e) {
        console.error('❌ Failed to initialize GoogleGenerativeAI:', e);
        return false;
    }
};

// Initialize AI on startup
initAI();

// @desc    Chat with AI Assistant
// @route   POST /api/ai/chat
// @access  Public
const chatWithAI = asyncHandler(async (req, res) => {
    console.log('🤖 Request Body:', JSON.stringify(req.body, null, 2));

    // Retry initialization if model is missing (lazy load)
    if (!model) {
        console.log('🔄 Model missing, retrying initialization...');
        const success = initAI();
        if (!success) {
            console.error('❌ Init failed during request.');
            res.status(503);
            throw new Error('AI Service Unavailable (Key missing or Init failed)');
        }
    }

    const { message, history } = req.body;

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    // Fetch services to give context to AI
    const services = await Service.find({ is_active: true }).select('name base_price category duration_minutes');
    const serviceContext = services.map(s =>
        `- ${s.name} (${s.category}): $${s.base_price}, ${s.duration_minutes} mins`
    ).join('\n');

    const systemPrompt = `
    You are "Glow", the friendly AI assistant for "Glow & Grace Beauty Parlour".
    Your goal is to help customers answer questions about services, pricing, and timing.
    
    Here is our Service Menu:
    ${serviceContext}

    Business Info:
    - We are open 9 AM - 8 PM daily.
    - Located at: 123 Beauty Lane, City Center.
    - To book, they can use the "Book Appointment" button on the site.

    Guidelines:
    - Be polite, professional, and concise (max 2-3 sentences).
    - If asked about booking, encourage them to sign up/login and book online.
    - Do NOT make up prices. Only use the provided menu.
    `;

    try {
        // Build full prompt with conversation history (simpler approach)
        const conversationHistory = (history || [])
            .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.parts[0]?.text || ''}`)
            .join('\n');

        const fullPrompt = `${systemPrompt}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n` : ''}User: ${message}

Please respond concisely as Glow, the AI assistant:`;

        console.log('📜 Full Prompt Length:', fullPrompt.length);

        // Use generateContent instead of startChat for better compatibility
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('❌ Gemini Error Detail:', JSON.stringify(error, null, 2));
        console.error('❌ Gemini Error Message:', error.message);
        res.status(500).json({
            message: 'AI could not respond',
            error: error.message
        });
    }
});

export { chatWithAI };
