'use client';

import React, { useState } from 'react';
import {
    Loader2,
    Map,
    MessageCircle,
    Plus,
    Send,
    ShoppingCart,
    X,
} from 'lucide-react';
import { getRecipeSuggestions, RecipeIngredientSuggestion } from '@/lib/api';
import { Product } from '@/types/customer';

interface ChatbotButtonProps {
    supermarketId?: string;
    onAddToList: (product: Product) => void;
    onAddCustomItem: (name: string) => void;
    onShowRoute: () => void;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({
    supermarketId,
    onAddToList,
    onAddCustomItem,
    onShowRoute,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [ingredients, setIngredients] = useState<RecipeIngredientSuggestion[]>([]);
    const [addedProductIds, setAddedProductIds] = useState<Set<string>>(new Set());
    const [addedCustomItems, setAddedCustomItems] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setReply('');
        setIngredients([]);
        setAddedProductIds(new Set());
        setAddedCustomItems(new Set());

        try {
            const response = await getRecipeSuggestions(trimmedMessage, supermarketId);
            setReply(response.reply);
            setIngredients(response.ingredients);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Could not get recipe suggestions right now.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const addIngredient = (ingredient: RecipeIngredientSuggestion) => {
        if (ingredient.product) {
            onAddToList(ingredient.product);
            setAddedProductIds((prev) => new Set(prev).add(ingredient.product!.id));
            return;
        }

        onAddCustomItem(ingredient.ingredient);
        setAddedCustomItems((prev) => new Set(prev).add(ingredient.ingredient));
    };

    const addAllMatchedIngredients = () => {
        const matchedIngredients = ingredients.filter((ingredient) => ingredient.product);

        matchedIngredients.forEach(addIngredient);

        if (matchedIngredients.length > 0) {
            onShowRoute();
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl md:bottom-24 md:right-6 md:left-auto">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-gray-900">Aisly assistant</h2>
                                <p className="text-xs text-gray-500">Ask for recipe ingredients</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            aria-label="Close chatbot"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex gap-2 border-b border-gray-100 p-3">
                        <input
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="I want to make steak lasagna..."
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-300 focus:bg-white"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !message.trim()}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Send recipe request"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </button>
                    </form>

                    <div className="max-h-[55vh] overflow-y-auto p-4">
                        {!reply && !error && !isLoading && (
                            <div className="rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
                                Try “I want to do a steak lasagna” and I’ll match the ingredients to products in this store.
                            </div>
                        )}

                        {error && (
                            <div className="rounded-xl bg-red-50 px-3 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {reply && (
                            <div className="mb-3 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-700">
                                {reply}
                            </div>
                        )}

                        {ingredients.length > 0 && (
                            <div className="space-y-2">
                                {ingredients.map((ingredient, index) => {
                                    const productId = ingredient.product?.id;
                                    const isAdded = productId
                                        ? addedProductIds.has(productId)
                                        : addedCustomItems.has(ingredient.ingredient);

                                    return (
                                        <div
                                            key={`${ingredient.ingredient}-${index}`}
                                            className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {ingredient.ingredient}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        {ingredient.quantity}
                                                    </p>
                                                    {ingredient.product ? (
                                                        <p className="mt-1 text-xs text-emerald-700">
                                                            Matched: {ingredient.product.name}
                                                        </p>
                                                    ) : (
                                                        <p className="mt-1 text-xs text-amber-700">
                                                            No store match. Add as a custom list item.
                                                        </p>
                                                    )}
                                                    {ingredient.note && (
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {ingredient.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => addIngredient(ingredient)}
                                                    disabled={isAdded}
                                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                                    aria-label={`Add ${ingredient.ingredient}`}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {ingredients.some((ingredient) => ingredient.product) && (
                        <div className="border-t border-gray-100 p-3">
                            <button
                                onClick={addAllMatchedIngredients}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                            >
                                <Map className="h-4 w-4" />
                                Add matched items and show route
                            </button>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => setIsOpen((current) => !current)}
                className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-xl active:bg-emerald-700 md:bottom-6"
                aria-label="Open chatbot"
            >
                <MessageCircle className="h-6 w-6" />
            </button>
        </>
    );
};

// Made with Bob
