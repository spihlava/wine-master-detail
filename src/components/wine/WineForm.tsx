'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { useCreateWine, useUpdateWine } from '@/lib/hooks/use-wines';
import { wineInsertSchema, wineTypeEnum } from '@/lib/types/wine';
import type { Wine, WineType } from '@/lib/types/wine';

interface WineFormProps {
    wine?: Wine;
}

const WINE_TYPES: { value: string; label: string }[] = wineTypeEnum.options.map(type => ({
    value: type,
    label: type,
}));

export function WineForm({ wine }: WineFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const createWine = useCreateWine();
    const updateWine = useUpdateWine(wine?.id || '');

    const [formData, setFormData] = useState({
        name: wine?.name || '',
        producer: wine?.producer || '',
        vintage: wine?.vintage || null as number | null,
        type: wine?.type || null as WineType | null,
        varietal: wine?.varietal || '',
        country: wine?.country || '',
        region: wine?.region || '',
        appellation: wine?.appellation || '',
        abv: wine?.abv || null as number | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        // Trim and prepare data for validation
        const trimmedData = {
            ...formData,
            name: formData.name.trim(),
            producer: formData.producer?.trim() || null,
            varietal: formData.varietal?.trim() || null,
            country: formData.country?.trim() || null,
            region: formData.region?.trim() || null,
            appellation: formData.appellation?.trim() || null,
        };

        // Use Zod for validation
        const result = wineInsertSchema.safeParse(trimmedData);

        if (!result.success) {
            result.error.issues.forEach(issue => {
                const field = issue.path[0] as string;
                newErrors[field] = issue.message;
            });
        }

        // Additional custom validations
        if (!trimmedData.name) {
            newErrors.name = 'Name is required';
        }
        if (formData.vintage !== null && (formData.vintage < 1800 || formData.vintage > 2100)) {
            newErrors.vintage = 'Vintage must be between 1800 and 2100';
        }
        if (formData.abv !== null && (formData.abv < 0 || formData.abv > 100)) {
            newErrors.abv = 'ABV must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            showToast('Please fix the errors in the form', 'error');
            return;
        }

        // Prepare clean data with trimmed strings
        const cleanData = {
            name: formData.name.trim(),
            producer: formData.producer?.trim() || null,
            vintage: formData.vintage,
            type: formData.type,
            varietal: formData.varietal?.trim() || null,
            country: formData.country?.trim() || null,
            region: formData.region?.trim() || null,
            appellation: formData.appellation?.trim() || null,
            abv: formData.abv,
        };

        try {
            if (wine) {
                await updateWine.mutateAsync(cleanData);
                showToast('Wine updated successfully', 'success');
            } else {
                await createWine.mutateAsync(cleanData);
                showToast('Wine added successfully', 'success');
            }
            router.push('/wines');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save wine';
            showToast(message, 'error');
            console.error('Error saving wine:', error);
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
