import Link from 'next/link';
import { WineList } from '@/components/wine/WineList';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function WinesPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Cellar</h1>
                    <p className="text-gray-500 mt-1">Manage your wine collection</p>
                </div>

                <Link href="/wines/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Wine
                    </Button>
                </Link>
            </div>

            <WineList />
        </main>
    );
}
