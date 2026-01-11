'use client';

import React from 'react';
import { WineForm } from '@/components/wine/WineForm';
import { useWine } from '@/lib/hooks/use-wines';

export default function EditWinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data: wine, isLoading, error } = useWine(id);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error loading wine: {error.message}</div>;
    if (!wine) return <div className="container mx-auto px-4 py-8 text-gray-500">Wine not found</div>;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Wine</h1>
                <p className="text-gray-500 mt-1">Update wine details</p>
            </div>
            <WineForm wine={wine} />
        </main>
    );
}
