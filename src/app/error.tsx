'use client';

import { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                    <h1 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h1>
                    <p className="text-red-600 mb-6">
                        {error.message || 'An unexpected error occurred'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <a
                            href="/wines"
                            className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
