'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatbotButtonProps {
    onClick?: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            alert('Chatbot feature coming soon! 🤖');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 md:bottom-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center"
            aria-label="Open chatbot"
        >
            <MessageCircle className="h-6 w-6" />
        </button>
    );
};

// Made with Bob
