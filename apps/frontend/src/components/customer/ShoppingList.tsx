'use client';

import React from 'react';
import { ShoppingListItem } from '@/types/customer';
import { Check, Trash2, MapPin, Minus, Plus, ShoppingCart } from 'lucide-react';

interface ShoppingListProps {
    items: ShoppingListItem[];
    onToggleCheck: (itemId: string) => void;
    onRemoveItem: (itemId: string) => void;
    onUpdateQuantity: (itemId: string, quantity: number) => void;
    onShowOnMap?: (item: ShoppingListItem) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
    items,
    onToggleCheck,
    onRemoveItem,
    onUpdateQuantity,
    onShowOnMap,
}) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const checkedItems = items.filter((item) => item.checked).length;
    const progress = items.length > 0 ? (checkedItems / items.length) * 100 : 0;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Mi Lista de Compras</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {checkedItems} de {items.length} completados
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
                {items.length === 0 ? (
                    <div className="text-center mt-12">
                        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-10 w-10 text-gray-300" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">Tu lista está vacía</p>
                        <p className="text-sm text-gray-500 mt-1">
                            Busca productos y agrégalos a tu lista
                        </p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl p-3.5 border transition-all ${
                                item.checked
                                    ? 'border-gray-100 opacity-60'
                                    : 'border-gray-100 shadow-sm'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Checkbox */}
                                <button
                                    onClick={() => onToggleCheck(item.id)}
                                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                                        item.checked
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-gray-300 hover:border-emerald-400'
                                    }`}
                                    aria-label={item.checked ? 'Desmarcar' : 'Marcar como completado'}
                                >
                                    {item.checked && <Check className="h-3.5 w-3.5 text-white" />}
                                </button>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <h3
                                        className={`font-semibold text-[15px] ${
                                            item.checked ? 'line-through text-gray-400' : 'text-gray-900'
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
                                            Pasillo {item.location.x}
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
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Made with Bob
