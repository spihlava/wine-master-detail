'use client';

import React, { useState } from 'react';
import { Bottle } from '@/lib/types/bottle';
import { useConsumeBottle } from '@/lib/hooks/use-bottles';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// Note: Assuming a generic Modal or Dialog component isn't readily available and simple enough to inline or use quickly without more research.
// For now, I'll build a simple overlay. If a Modal component existed in ui/, I'd use it.
// I'll check Button.tsx and Input.tsx existed, so I'll trust simple Tailwind modal.

interface ConsumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    bottle: Bottle;
}

export const ConsumeModal: React.FC<ConsumeModalProps> = ({ isOpen, onClose, bottle }) => {
    const [rating, setRating] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const consumeBottle = useConsumeBottle(bottle.wine_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        consumeBottle.mutate({
            id: bottle.id,
            rating: typeof rating === 'number' ? rating : undefined,
            notes: notes || undefined,
            date: new Date(date).toISOString()
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Consume Bottle</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date Consumed</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rating (0-100)</label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={rating}
                            onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Optional"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tasting Notes</label>
                        <textarea
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="How was it?"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Complete</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
