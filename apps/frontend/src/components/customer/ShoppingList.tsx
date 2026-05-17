'use client';

import React, { useState } from 'react';
import { ShoppingListItem } from '@/types/customer';
import { Check, Trash2, MapPin, Minus, Plus, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';

interface ShoppingListProps {
    items: ShoppingListItem[];
    onToggleCheck: (itemId: string) => void;
    onRemoveItem: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onShowOnMap?: (item: ShoppingListItem) => void;
    isLoading?: boolean;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
    items,
    onToggleCheck,
    onRemoveItem,
    onUpdateQuantity,
    onShowOnMap,
    isLoading = false,
}) => {
    const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

    const handleRemoveItem = (itemId: string) => {
        setRemovingItems(prev => new Set(prev).add(itemId));
        setTimeout(() => {
            onRemoveItem(itemId);
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }, 300);
    };
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const checkedItems = items.filter((item) => item.checked).length;
    const uncheckedItems = items.filter((item) => !item.checked).length;
    const progress = items.length > 0 ? (checkedItems / items.length) * 100 : 0;
    const isComplete = items.length > 0 && checkedItems === items.length;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">My Shopping List</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {checkedItems} of {items.length} completed
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-bold text-emerald-600">{totalItems}</p>
                    </div>
                </div>
                {/* Progress bar */}
                {items.length > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 ease-out rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-sm font-semibold text-emerald-600 min-w-[40px] text-right">
                            {Math.round(progress)}%
                        </span>
                    </div>
                )}
            </div>

            {/* List Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {isComplete && (
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 mb-4 animate-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 rounded-full p-2">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">List complete! 🎉</p>
                                <p className="text-sm text-emerald-50">You found all your products</p>
                            </div>
                        </div>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="text-center mt-12 animate-in fade-in duration-500">
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-10 w-10 text-gray-300" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">Your list is empty</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Search for products and add them to your list
                        </p>
                        <div className="mt-4 text-xs text-gray-400">
                            💡 Tip: Use the "Search" tab to find products
                        </div>
                    </div>
                ) : (
                    <>
                        {uncheckedItems > 0 && (
                            <div className="mb-3 px-1 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-emerald-600">{uncheckedItems}</span> {uncheckedItems === 1 ? 'pending item' : 'pending items'}
                                </p>
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                        )}
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl p-3.5 border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${removingItems.has(item.id)
                                    ? 'opacity-0 scale-95'
                                    : item.checked
                                        ? 'border-gray-100 opacity-60'
                                        : 'border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => onToggleCheck(item.id)}
                                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${item.checked
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-gray-300 hover:border-emerald-400'
                                            }`}
                                        aria-label={item.checked ? 'Mark as pending' : 'Mark as complete'}
                                    >
                                        {item.checked && <Check className="h-3.5 w-3.5 text-white" />}
                                    </button>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className={`font-semibold text-[15px] ${item.checked ? 'line-through text-gray-400' : 'text-gray-900'
                                                }`}
                                        >
                                            {item.productName}
                                        </h3>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                }
                                                disabled={item.quantity <= 1}
                                                className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Minus className="h-3.5 w-3.5 text-gray-600" />
                                            </button>
                                            <span className="text-sm font-bold text-gray-800 w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus className="h-3.5 w-3.5 text-gray-600" />
                                            </button>
                                        </div>

                                        {/* Location Info */}
                                        {item.location && (
                                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {item.location.label || `Position ${item.location.x}, ${item.location.y}`}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-1.5">
                                        {onShowOnMap && item.location && (
                                            <button
                                                onClick={() => onShowOnMap(item)}
                                                className="p-2 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                                            >
                                                <MapPin className="h-4 w-4 text-emerald-600" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={removingItems.has(item.id)}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all active:scale-90 disabled:opacity-50"
                                            title="Remove from list"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

// Made with Bob
