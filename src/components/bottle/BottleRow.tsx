'use client';

import React, { useState, useEffect, useId } from 'react';
import { Bottle } from '@/lib/types/bottle';
import { StatusBadge } from '@/components/generic/StatusBadge';
import { Button } from '@/components/ui/Button';
import { ConsumeModal } from './ConsumeModal';
import { useDeleteBottle, useUpdateBottle } from '@/lib/hooks/use-bottles';
import { useToast } from '@/components/ui/Toast';
import { Trash2, Wine, MapPin } from 'lucide-react';

interface BottleRowProps {
    bottle: Bottle;
}

export const BottleRow: React.FC<BottleRowProps> = ({ bottle }) => {
    const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [location, setLocation] = useState(bottle.location || '');
    const [bin, setBin] = useState(bottle.bin || '');

    const locationId = useId();
    const binId = useId();
    const { showToast } = useToast();

    // Sync local state when bottle prop changes
    useEffect(() => {
        setLocation(bottle.location || '');
        setBin(bottle.bin || '');
    }, [bottle.location, bottle.bin]);

    const deleteBottle = useDeleteBottle(bottle.wine_id);
    const updateBottle = useUpdateBottle(bottle.wine_id);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this bottle?')) {
            deleteBottle.mutate(bottle.id, {
                onSuccess: () => showToast('Bottle deleted', 'success'),
                onError: (error) => showToast(error instanceof Error ? error.message : 'Failed to delete', 'error'),
            });
        }
    };

    const handleLocationUpdate = () => {
        updateBottle.mutate({
            id: bottle.id,
            updates: { location: location.trim(), bin: bin.trim() }
        }, {
            onSuccess: () => {
                showToast('Location updated', 'success');
                setIsEditing(false);
            },
            onError: (error) => showToast(error instanceof Error ? error.message : 'Failed to update', 'error'),
        });
    };

    const handleCancelEdit = () => {
        setLocation(bottle.location || '');
        setBin(bottle.bin || '');
        setIsEditing(false);
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={bottle.status} />
                {bottle.status === 'consumed' && bottle.consumed_date && (
                    <div className="text-xs text-slate-500 mt-1">
                        {new Date(bottle.consumed_date).toLocaleDateString()}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <div className="flex space-x-2 items-center">
                        <div>
                            <label htmlFor={locationId} className="sr-only">Location</label>
                            <input
                                id={locationId}
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Location"
                                aria-label="Location"
                                className="w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-wine-500"
                            />
                        </div>
                        <div>
                            <label htmlFor={binId} className="sr-only">Bin</label>
                            <input
                                id={binId}
                                type="text"
                                value={bin}
                                onChange={(e) => setBin(e.target.value)}
                                placeholder="Bin"
                                aria-label="Bin"
                                className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-wine-500"
                            />
                        </div>
                        <Button size="sm" className="h-7 px-2 text-xs" onClick={handleLocationUpdate} disabled={updateBottle.isPending}>
                            {updateBottle.isPending ? '...' : 'Save'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={handleCancelEdit}>
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="flex items-center space-x-2 group text-left"
                        onClick={() => bottle.status === 'cellar' && setIsEditing(true)}
                        disabled={bottle.status !== 'cellar'}
                        aria-label={bottle.status === 'cellar' ? 'Click to edit location' : undefined}
                    >
                        <span className="text-sm text-slate-900">
                            {bottle.location || 'No Location'}
                            {bottle.bin && <span className="text-slate-500 ml-1">({bottle.bin})</span>}
                        </span>
                        {bottle.status === 'cellar' && (
                            <MapPin className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
                        )}
                    </button>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {new Date(bottle.created_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    {bottle.status === 'cellar' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:text-purple-900 hover:bg-purple-50"
                            onClick={() => setIsConsumeModalOpen(true)}
                            title="Consume Bottle"
                        >
                            <Wine className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 hover:bg-red-50"
                        onClick={handleDelete}
                        title="Delete Bottle"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                <ConsumeModal
                    isOpen={isConsumeModalOpen}
                    onClose={() => setIsConsumeModalOpen(false)}
                    bottle={bottle}
                />
            </td>
        </tr>
    );
};
