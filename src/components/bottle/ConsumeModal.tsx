'use client';

import { X } from 'lucide-react';
import React, { useState, useEffect, useRef, useId } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useConsumeBottle } from '@/lib/hooks/use-bottles';
import { Bottle } from '@/lib/types/bottle';

interface ConsumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    bottle: Bottle;
}

export const ConsumeModal: React.FC<ConsumeModalProps> = ({ isOpen, onClose, bottle }) => {
    const [rating, setRating] = useState<number | ''>('');
    const [notes, setNotes] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const titleId = useId();
    const modalRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const consumeBottle = useConsumeBottle(bottle.wine_id);

    // Focus trap and escape key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Focus the modal when it opens
        modalRef.current?.focus();

        document.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        consumeBottle.mutate({
            id: bottle.id,
            rating: typeof rating === 'number' ? rating : undefined,
            notes: notes.trim() || undefined,
            date: new Date(date).toISOString()
        }, {
            onSuccess: () => {
                showToast('Bottle marked as consumed', 'success');
                onClose();
            },
            onError: (error) => {
                showToast(error instanceof Error ? error.message : 'Failed to consume bottle', 'error');
            }
        });
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackdropClick}
            role="presentation"
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 focus:outline-none"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 id={titleId} className="text-lg font-medium text-slate-900">Consume Bottle</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded hover:bg-slate-100 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

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
                        <Button type="button" variant="ghost" onClick={onClose} disabled={consumeBottle.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={consumeBottle.isPending}>
                            {consumeBottle.isPending ? 'Saving...' : 'Complete'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
