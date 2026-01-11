'use client';

import { WineForm } from '@/components/wine/WineForm';
import { useWine } from '@/lib/hooks/use-wines';

export default function EditWinePage({ params }: { params: { id: string } }) {
    const { data: wine, isLoading } = useWine(params.id);

    if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
    if (!wine) return <div className="container mx-auto px-4 py-8">Wine not found</div>;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Wine</h1>
                <p className="text-gray-500 mt-1">Update wine details</p>
            </div>
            <WineForm wine={wine} />
        </main>
    );
}
