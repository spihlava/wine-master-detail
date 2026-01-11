import { WineDetail } from '@/components/wine/WineDetail';

export default async function WineDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main className="container mx-auto px-4 py-8">
            <WineDetail wineId={id} />
        </main>
    );
}
