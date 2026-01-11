import { WineForm } from '@/components/wine/WineForm';

export default function NewWinePage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add Wine</h1>
                <p className="text-gray-500 mt-1">Create a new wine master record</p>
            </div>
            <WineForm />
        </main>
    );
}
