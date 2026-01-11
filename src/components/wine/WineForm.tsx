'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateWine, useUpdateWine } from '@/lib/hooks/use-wines';
import type { Wine, WineInsert, WineType } from '@/lib/types/wine';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';

interface WineFormProps {
    wine?: Wine;
}

const WINE_TYPES: { value: string; label: string }[] = [
    { value: 'Red', label: 'Red' },
    { value: 'White', label: 'White' },
    { value: 'Rosé', label: 'Rosé' },
    { value: 'Sparkling', label: 'Sparkling' },
    { value: 'Dessert', label: 'Dessert' },
    { value: 'Fortified', label: 'Fortified' },
];

export function WineForm({ wine }: WineFormProps) {
    const router = useRouter();
    const createWine = useCreateWine();
    const updateWine = useUpdateWine(wine?.id || '');

    const [formData, setFormData] = useState<Partial<WineInsert>>({
        name: wine?.name || '',
        producer: wine?.producer || '',
        vintage: wine?.vintage || null,
        type: wine?.type || null,
        varietal: wine?.varietal || '',
        country: wine?.country || '',
        region: wine?.region || '',
        appellation: wine?.appellation || '',
        abv: wine?.abv || null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (wine) {
                await updateWine.mutateAsync(formData);
            } else {
                await createWine.mutateAsync(formData as WineInsert);
            }
            router.push('/wines');
        } catch (error) {
            console.error('Error saving wine:', error);
            // In a real app, show a toast here
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">{wine ? 'Edit Wine' : 'Add New Wine'}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <Input
                            label="Wine Name *"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                            placeholder="e.g. Château Margaux"
                        />
                    </div>

                    <Input
                        label="Producer"
                        value={formData.producer || ''}
                        onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                        placeholder="e.g. Château Margaux"
                    />

                    <Input
                        label="Vintage"
                        type="number"
                        value={formData.vintage || ''}
                        onChange={(e) => setFormData({ ...formData, vintage: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="e.g. 2018"
                    />

                    <Select
                        label="Type"
                        options={WINE_TYPES}
                        value={formData.type || ''}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as WineType })}
                    />

                    <Input
                        label="Varietal"
                        value={formData.varietal || ''}
                        onChange={(e) => setFormData({ ...formData, varietal: e.target.value })}
                        placeholder="e.g. Cabernet Sauvignon"
                    />

                    <Input
                        label="Country"
                        value={formData.country || ''}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. France"
                    />

                    <Input
                        label="Region"
                        value={formData.region || ''}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        placeholder="e.g. Bordeaux"
                    />

                    <Input
                        label="Appellation"
                        value={formData.appellation || ''}
                        onChange={(e) => setFormData({ ...formData, appellation: e.target.value })}
                        placeholder="e.g. Margaux"
                    />

                    <Input
                        label="ABV %"
                        type="number"
                        step="0.1"
                        value={formData.abv || ''}
                        onChange={(e) => setFormData({ ...formData, abv: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="e.g. 13.5"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={createWine.isPending || updateWine.isPending}
                    >
                        {createWine.isPending || updateWine.isPending ? 'Saving...' : (wine ? 'Update Wine' : 'Add Wine')}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
