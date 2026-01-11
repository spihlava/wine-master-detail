'use client';

import { useWine, useDeleteWine } from '@/lib/hooks/use-wines';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function WineDetail({ wineId }: { wineId: string }) {
    const router = useRouter();
    const { data: wine, isLoading, error } = useWine(wineId);
    const deleteWine = useDeleteWine();
    const [isDeleting, setIsDeleting] = useState(false);

    if (isLoading) return <div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>;
    if (error) return <div className="text-red-500">Error loading wine details</div>;
    if (!wine) return <div className="text-gray-500">Wine not found</div>;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this wine? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            await deleteWine.mutateAsync(wine.id);
            router.push('/wines');
        } catch (error) {
            console.error('Error deleting wine:', error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <Button variant="ghost" className="gap-2 pl-0" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                <div className="flex gap-2">
                    <Link href={`/wines/${wine.id}/edit`}>
                        <Button variant="outline" className="gap-2">
                            <Edit className="w-4 h-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        className="gap-2"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <div className="border-b border-gray-100 pb-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">{wine.name}</h1>
                            {wine.producer && <p className="text-xl text-gray-600 mt-1">{wine.producer}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">Vintage</label>
                                <p className="text-lg text-gray-900">{wine.vintage || 'NV'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">Type</label>
                                <p className="text-lg text-gray-900">{wine.type || '-'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">Varietal</label>
                                <p className="text-lg text-gray-900">{wine.varietal || '-'}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">ABV</label>
                                <p className="text-lg text-gray-900">{wine.abv ? `${wine.abv}%` : '-'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Region & Origin</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">Country</label>
                                <p className="text-gray-900">{wine.country || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">Region</label>
                                <p className="text-gray-900">{wine.region || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-1">Appellation</label>
                                <p className="text-gray-900">{wine.appellation || '-'}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Placeholder for bottle stats or sidebar info */}
                    <Card className="bg-wine-50 border-wine-100">
                        <h3 className="text-lg font-semibold text-wine-900 mb-2">Inventory</h3>
                        <p className="text-wine-700">0 Bottles in Cellar</p>
                        <Link href={`/wines/${wine.id}/add-bottle`}>
                            <Button variant="outline" className="w-full mt-4 bg-white border-wine-200 text-wine-700 hover:bg-wine-50">
                                + Add Bottle
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
