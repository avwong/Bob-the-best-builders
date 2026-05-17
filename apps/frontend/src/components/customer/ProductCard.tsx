'use client';

import React, { useState } from 'react';
import { Plus, MapPin, Check, Package, TrendingUp, Star } from 'lucide-react';
import { Product } from '@/types/customer';
import { Card } from '@/components/ui/card';

interface ProductCardProps {
    product: Product;
    onAddToList: (product: Product) => void;
    onShowOnMap?: (product: Product) => void;
    isInList?: boolean;
    compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToList,
    onShowOnMap,
    isInList = false,
    compact = false,
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToList = () => {
        setIsAdding(true);
        onAddToList(product);

        // Show success animation
        setTimeout(() => {
            setIsAdding(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 300);
    };

    if (compact) {
        return (
            <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {product.category}
                            </span>
                            {product.inStock ? (
                                <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                                    <Check className="h-3 w-3" />
                                    In stock
                                </span>
                            ) : (
                                <span className="text-xs text-red-500 font-medium">
                                    Out of stock
                                </span>
                            )}
                        </div>
                        <span className="text-lg font-bold text-emerald-600 mt-1 block">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>
                    <button
                        onClick={handleAddToList}
                        disabled={!product.inStock || isAdding}
                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-100">
            {/* Stock badge */}
            {!product.inStock && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Out of stock
                    </span>
                </div>
            )}

            {/* Success overlay */}
            {showSuccess && (
                <div className="absolute inset-0 bg-emerald-500/90 z-20 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="text-center text-white">
                        <div className="bg-white/20 rounded-full p-3 inline-block mb-2">
                            <Check className="h-8 w-8" />
                        </div>
                        <p className="font-bold text-lg">Added!</p>
                    </div>
                </div>
            )}

            <div className="p-5">
                {/* Product image placeholder */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl h-40 mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Package className="h-16 w-16 text-emerald-300" />
                    {/* Decorative elements */}
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                </div>

                {/* Product info */}
                <div className="space-y-3">
                    {/* Category badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                            {product.category}
                        </span>
                        {product.inStock && (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Available
                            </span>
                        )}
                    </div>

                    {/* Product name */}
                    <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
                        {product.name}
                    </h3>

                    {/* Location */}
                    {product.location && (product.location.x || product.location.aisleNumber) && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>
                                {product.location.aisleNumber
                                    ? `Aisle ${product.location.aisleNumber}`
                                    : `Location: (${product.location.x}, ${product.location.y})`}
                            </span>
                        </div>
                    )}

                    {/* Price and actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Price</p>
                            <p className="text-2xl font-bold text-emerald-600 flex items-baseline gap-1">
                                ${product.price.toFixed(2)}
                                <TrendingUp className="h-4 w-4 text-emerald-400" />
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {onShowOnMap && product.location && (
                                <button
                                    onClick={() => onShowOnMap(product)}
                                    className="p-2.5 rounded-lg border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-all"
                                    title="View on map"
                                >
                                    <MapPin className="h-5 w-5" />
                                </button>
                            )}

                            <button
                                onClick={handleAddToList}
                                disabled={!product.inStock || isAdding || isInList}
                                className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${isInList
                                    ? 'bg-gray-100 text-gray-500 cursor-default'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95'
                                    } disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none`}
                                title={isInList ? 'Already in your list' : 'Add to list'}
                            >
                                {isAdding ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        <span>Adding...</span>
                                    </>
                                ) : isInList ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        <span>In list</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        <span>Add</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 border-2 border-emerald-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Card>
    );
};

// Made with Bob
