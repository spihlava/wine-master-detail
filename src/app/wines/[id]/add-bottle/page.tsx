'use client';

import { useAddMultipleBottles } from '@/lib/hooks/use-bottles';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useWine } from '@/lib/hooks/use-wines';
import React from 'react';

// Using useSearchParams or params? It's a page, so params.
// But we need to unwrap params in Next.js 15+ 
// However, I'll use the pattern seen in WineDetail (await params).

export default function AddBottlePage({ params }: { params: Promise<{ id: string }> }) {
    // Need to unwrap params
    const resolvedParams = React.use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const { data: wine, isLoading } = useWine(id);
    const addBottles = useAddMultipleBottles(id);

    const [count, setCount] = useState(1);
    const [location, setLocation] = useState('');
    const [bin, setBin] = useState('');
    const [price, setPrice] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addBottles.mutateAsync({
                count: Number(count),
                details: {
                    location: location || undefined,
                    bin: bin || undefined,
                    purchase_price: price ? Number(price) : undefined,
                    purchase_date: new Date().toISOString()
                }
            });
            router.push(`/wines/${id}`);
        } catch (error) {
            console.error('Failed to add bottles', error);
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (!wine) return <div className="p-8 text-center">Wine not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Button variant="ghost" className="gap-2 pl-0 mb-6" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
                Back to Wine
            </Button>

            <Card>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Add Bottles</h1>
                    <p className="text-gray-600">Adding to: {wine.name} {wine.vintage}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Bottles
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location (Optional)
                            </label>
                            <Input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Cellar A"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bin (Optional)
                            </label>
                            <Input
                                type="text"
                                value={bin}
                                onChange={(e) => setBin(e.target.value)}
                                placeholder="e.g. A1"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Purchase Price (per bottle)
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : `Add ${count} Bottle${count > 1 ? 's' : ''}`}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
