import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Hi! I am Glow, your AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // In production, use environment variable for API URL
            const apiUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

            const { data } = await axios.post(`${apiUrl}/ai/chat`, {
                message: userMessage,
                history: messages.map(m => ({
                    role: m.sender === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }))
            });

            setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            <div
                className={`bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-80 sm:w-96 overflow-hidden transition-all duration-300 pointer-events-auto border border-gray-200 dark:border-gray-700 ${isOpen ? 'opacity-100 scale-100 mb-4' : 'opacity-0 scale-95 h-0 mb-0'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <FaRobot className="text-xl" />
                        <h3 className="font-semibold">Glow AI Assistant</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                        <FaTimes />
                    </button>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none animate-pulse">
                                <span className="text-gray-500 dark:text-gray-400 text-xs">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about prices, services..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>

            {/* Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white ${isOpen ? 'bg-red-500 rotate-90 scale-0 opacity-0 absolute' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-110'
                    }`}
            >
                <FaRobot className="text-2xl animate-bounce" />
            </button>
        </div>
    );
};

export default Chatbot;
