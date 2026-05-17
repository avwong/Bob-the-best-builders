'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Plus, MapPin, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { Product } from '@/types/customer';

interface ProductSearchProps {
    products: Product[];
    onAddToList: (product: Product) => void;
    onShowOnMap?: (product: Product) => void;
    isLoading?: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
    products,
    onAddToList,
    onShowOnMap,
    isLoading = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return products.filter(
            (product) =>
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
        );
    }, [searchQuery, products]);

    // Simulate search delay for better UX
    useEffect(() => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            const timer = setTimeout(() => setIsSearching(false), 300);
            return () => clearTimeout(timer);
        } else {
            setIsSearching(false);
        }
    }, [searchQuery]);

    const handleAddToList = (product: Product) => {
        onAddToList(product);
        setAddedProducts(prev => new Set(prev).add(product.id));

        // Remove from added set after animation
        setTimeout(() => {
            setAddedProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }, 2000);
    };

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
                        placeholder="Search products..."
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
                {isLoading ? (
                    <div className="text-center mt-12">
                        <Loader2 className="h-12 w-12 mx-auto mb-3 text-emerald-500 animate-spin" />
                        <p className="text-lg font-semibold text-gray-700">Cargando productos...</p>
                        <p className="text-sm text-gray-500 mt-1">Un momento por favor</p>
                    </div>
                ) : searchQuery.trim() === '' ? (
                    <div className="text-center mt-12 animate-in fade-in duration-500">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 relative">
                            <ShoppingBag className="h-10 w-10 text-emerald-500" />
                            <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                        </div>
                        <p className="text-lg font-semibold text-gray-800">What do you need today?</p>
                        <p className="text-sm text-gray-500 mt-1">Search by name or category</p>
                        <div className="mt-4 text-xs text-gray-400">
                            💡 Tip: Try searching "milk", "bread" or "fruits"
                        </div>
                    </div>
                ) : isSearching ? (
                    <div className="text-center mt-12">
                        <Loader2 className="h-8 w-8 mx-auto mb-3 text-emerald-500 animate-spin" />
                        <p className="text-sm text-gray-600">Searching...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center mt-12 animate-in fade-in duration-300">
                        <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700">No products found</p>
                        <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                        <p className="text-xs text-gray-400 mt-2">You searched: "{searchQuery}"</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-3 px-1">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-emerald-600">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'result' : 'results'} found
                            </p>
                        </div>
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${index * 50}ms` }}
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
                                                    ✓ In stock
                                                </span>
                                            ) : (
                                                <span className="text-xs text-red-500 font-medium">
                                                    Out of stock
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
                                                    Aisle {product.location.x}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <button
                                            onClick={() => handleAddToList(product)}
                                            disabled={!product.inStock}
                                            className={`relative overflow-hidden rounded-lg px-3 py-2 text-xs font-semibold flex items-center gap-1 transition-all ${addedProducts.has(product.id)
                                                ? 'bg-green-500 text-white'
                                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                } disabled:opacity-40 disabled:cursor-not-allowed active:scale-95`}
                                        >
                                            {addedProducts.has(product.id) ? (
                                                <>
                                                    <span className="animate-in zoom-in duration-200">✓</span>
                                                    <span className="animate-in slide-in-from-right duration-200">Added</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add
                                                </>
                                            )}
                                        </button>
                                        {onShowOnMap && product.location && (
                                            <button
                                                onClick={() => onShowOnMap(product)}
                                                className="border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1 transition-colors"
                                            >
                                                <MapPin className="h-3.5 w-3.5" />
                                                View
                                            </button>
                                        )}
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
