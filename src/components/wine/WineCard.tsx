import Link from 'next/link';
import React, { memo } from 'react';
import { Card } from '@/components/ui/Card';
import type { Wine } from '@/lib/types/wine';

export const WineCard = memo(function WineCard({ wine }: { wine: Wine }) {
    return (
        <Link href={`/wines/${wine.id}`}>
            <Card className="hover:shadow-md transition-shadow h-full cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-wine-700 transition-colors">
                            {wine.name}
                        </h2>
                        {wine.producer && (
                            <p className="text-gray-600 font-medium">{wine.producer}</p>
                        )}
                    </div>
                    {wine.vintage && (
                        <span className="text-2xl font-light text-wine-600">
                            {wine.vintage}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {wine.type && (
                        <span className="px-2 py-1 bg-wine-50 text-wine-800 rounded text-sm font-medium">
                            {wine.type}
                        </span>
                    )}
                    {wine.region && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {wine.region}
                        </span>
                    )}
                    {wine.country && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            {wine.country}
                        </span>
                    )}
                </div>
            </Card>
        </Link>
    );
});
