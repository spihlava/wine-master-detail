'use client';

import React from 'react';
import { useBottles, useAddMultipleBottles } from '@/lib/hooks/use-bottles';
import { BottleRow } from './BottleRow';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'; // Assume this exists or handle loading
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface BottleTableProps {
    wineId: string;
}

export const BottleTable: React.FC<BottleTableProps> = ({ wineId }) => {
    const { data: bottles, isLoading, error } = useBottles(wineId);
    const addMultiple = useAddMultipleBottles(wineId);

    if (isLoading) return <div className="p-4 text-center">Loading bottles...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error loading bottles</div>;

    const handleAddBottle = () => {
        addMultiple.mutate({ count: 1 });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-900">Bottles ({bottles?.length || 0})</h3>
                <Button onClick={handleAddBottle} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bottle
                </Button>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location / Bin</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Added</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {bottles?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    No bottles tracked yet. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            bottles?.map((bottle) => (
                                <BottleRow key={bottle.id} bottle={bottle} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
