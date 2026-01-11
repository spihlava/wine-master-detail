import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={cn("bg-white rounded-xl shadow-sm border border-gray-100 p-6", className)}
            {...props}
        >
            {children}
        </div>
    );
}
