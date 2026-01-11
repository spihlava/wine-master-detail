'use client';

import React, { useState } from 'react';
import { useAddMultipleBottles } from '@/lib/hooks/use-bottles';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { useWine } from '@/lib/hooks/use-wines';
import { useToast } from '@/components/ui/Toast';

export default function AddBottlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);

    const router = useRouter();
    const { showToast } = useToast();
    const { data: wine, isLoading, error } = useWine(id);
    const addBottles = useAddMultipleBottles(id);

    const [count, setCount] = useState(1);
    const [location, setLocation] = useState('');
    const [bin, setBin] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addBottles.mutateAsync({
                count: Number(count),
                details: {
                    location: location.trim() || undefined,
                    bin: bin.trim() || undefined,
                    purchase_price: price ? Number(price) : undefined,
                    purchase_date: new Date().toISOString()
                }
            });
            showToast(`Added ${count} bottle${count > 1 ? 's' : ''} successfully`, 'success');
            router.push(`/wines/${id}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add bottles';
            showToast(message, 'error');
            console.error('Failed to add bottles', error);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;
    if (!wine) return <div className="p-8 text-center text-gray-500">Wine not found</div>;

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
                        <Button type="submit" disabled={addBottles.isPending}>
                            {addBottles.isPending ? 'Adding...' : `Add ${count} Bottle${count > 1 ? 's' : ''}`}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
