'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Plus, MapPin, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/customer';

interface ProductSearchProps {
    products: Product[];
    onAddToList: (product: Product) => void;
    onShowOnMap?: (product: Product) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
    products,
    onAddToList,
    onShowOnMap,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
        );
    }, [searchQuery, products]);

    // Group by category for better display
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats);
    }, [products]);

    return (
        <div className="flex flex-col h-full">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                </div>
                {/* Quick category chips */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                    {categories.slice(0, 6).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSearchQuery(cat)}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap border border-emerald-200"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {searchQuery.trim() === '' ? (
                    <div className="text-center mt-12">
                        <div className="bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-10 w-10 text-emerald-400" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">¿Qué necesitas hoy?</p>
                        <p className="text-sm text-gray-500 mt-1">Busca por nombre o categoría</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center mt-12">
                        <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-semibold text-gray-700">No se encontraron productos</p>
                        <p className="text-sm text-gray-500 mt-1">Intenta con otro término de búsqueda</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-[15px] truncate">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            {product.category}
                                        </span>
                                        {product.inStock ? (
                                            <span className="text-xs text-emerald-600 font-medium">
                                                ✓ En stock
                                            </span>
                                        ) : (
                                            <span className="text-xs text-red-500 font-medium">
                                                Agotado
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className="text-lg font-bold text-emerald-600">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {product.location && (
                                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                                <MapPin className="h-3 w-3" />
                                                Pasillo {product.location.x}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        onClick={() => onAddToList(product)}
                                        disabled={!product.inStock}
                                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Agregar
                                    </button>
                                    {onShowOnMap && product.location && (
                                        <button
                                            onClick={() => onShowOnMap(product)}
                                            className="border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <MapPin className="h-3.5 w-3.5" />
                                            Ver
                                        </button>
                                    )}
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
