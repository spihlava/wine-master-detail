import React from 'react';

type StatusType = 'cellar' | 'consumed' | 'gifted' | 'sold' | 'damaged' | 'lost';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const statusStyles: Record<StatusType, string> = {
    'cellar': 'bg-green-100 text-green-800 border-green-200',
    'consumed': 'bg-gray-100 text-gray-800 border-gray-200',
    'gifted': 'bg-purple-100 text-purple-800 border-purple-200',
    'sold': 'bg-blue-100 text-blue-800 border-blue-200',
    'damaged': 'bg-red-100 text-red-800 border-red-200',
    'lost': 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const style = statusStyles[status as StatusType] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}>
            {status}
        </span>
    );
};
