export const LoadingSpinner = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-wine-600 ${className}`} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};
