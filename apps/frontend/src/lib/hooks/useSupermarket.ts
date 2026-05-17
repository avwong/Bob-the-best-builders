'use client';

import { useCallback, useEffect, useState } from 'react';
import type { StoreLayoutForMap, Supermarket } from '@/lib/api';
import {
    getSupermarketLayout,
    getSupermarkets,
    mapSupermarketLayout,
} from '@/lib/api';

export function useSupermarket(initialSupermarketId?: string) {
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
    const [selectedSupermarket, setSelectedSupermarket] = useState<Supermarket | null>(null);
    const [layout, setLayout] = useState<StoreLayoutForMap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSupermarket = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const allSupermarkets = await getSupermarkets();
            setSupermarkets(allSupermarkets);

            const supermarket =
                allSupermarkets.find((item) => item.id === initialSupermarketId) ??
                allSupermarkets[0];

            if (!supermarket) {
                throw new Error('No supermarkets found in the backend');
            }

            setSelectedSupermarket(supermarket);

            const backendLayout = await getSupermarketLayout(supermarket.id);
            setLayout(mapSupermarketLayout(backendLayout));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not load supermarket');
            setSelectedSupermarket(null);
            setLayout(null);
        } finally {
            setIsLoading(false);
        }
    }, [initialSupermarketId]);

    useEffect(() => {
        loadSupermarket();
    }, [loadSupermarket]);

    useEffect(() => {
        const handleLayoutChanged = () => {
            void loadSupermarket();
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === 'aisly-layout-updated') {
                handleLayoutChanged();
            }
        };

        const channel =
            typeof BroadcastChannel !== 'undefined'
                ? new BroadcastChannel('aisly-layout')
                : null;

        channel?.addEventListener('message', handleLayoutChanged);
        window.addEventListener('focus', handleLayoutChanged);
        window.addEventListener('storage', handleStorage);
        window.addEventListener('aisly-layout-saved', handleLayoutChanged);

        return () => {
            channel?.removeEventListener('message', handleLayoutChanged);
            channel?.close();
            window.removeEventListener('focus', handleLayoutChanged);
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('aisly-layout-saved', handleLayoutChanged);
        };
    }, [loadSupermarket]);

    return {
        supermarkets,
        selectedSupermarket,
        layout,
        isLoading,
        error,
        refetch: loadSupermarket,
    };
}
