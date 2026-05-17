'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Product } from '@/types/customer';
import {
    getProducts,
    mapBackendProduct,
    searchProducts as searchProductsApi,
} from '@/lib/api';

interface UseProductsOptions {
    supermarketId?: string;
    limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
    const { supermarketId, limit = 100 } = options;
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getProducts({ page: 1, limit, supermarketId });
            setProducts(response.data.map(mapBackendProduct));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not load products');
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [limit, supermarketId]);

    const searchProducts = useCallback(
        async (query: string) => {
            const results = await searchProductsApi(query, supermarketId);
            return results.map(mapBackendProduct);
        },
        [supermarketId]
    );

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        products,
        isLoading,
        error,
        refetch: loadProducts,
        searchProducts,
    };
}
