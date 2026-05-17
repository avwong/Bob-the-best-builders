'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatbotButtonProps {
    onClick?: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({ onClick }) => {
    const [showToast, setShowToast] = useState(false);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    return (
        <>
            {showToast && (
                <div className="fixed bottom-36 right-4 z-50 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2">
                    <span>Chatbot coming soon!</span>
                    <button onClick={() => setShowToast(false)} className="ml-1 text-gray-400 hover:text-white">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
            <button
                onClick={handleClick}
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 md:bottom-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center"
                aria-label="Open chatbot"
            >
                <MessageCircle className="h-6 w-6" />
            </button>
        </>
    );
};

// Made with Bob
