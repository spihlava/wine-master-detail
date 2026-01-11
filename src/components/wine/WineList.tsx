'use client';

import { useWines } from '@/lib/hooks/use-wines';
import { WineCard } from './WineCard';
import { AlertCircle } from 'lucide-react';

export function WineList() {
    const { data: wines, isLoading, error } = useWines();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-100 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <p>Error loading wines. Please try refreshing.</p>
            </div>
        );
    }

    if (!wines?.length) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">No wines yet</h3>
                <p className="text-gray-500 mt-1">Start your collection by adding a wine.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wines.map((wine) => (
                <WineCard key={wine.id} wine={wine} />
            ))}
        </div>
    );
}
