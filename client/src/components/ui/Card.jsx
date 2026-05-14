import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, glass = false, ...props }) {
    return (
        <div
            className={twMerge(
                'rounded-2xl p-6 transition-all duration-300',
                glass ? 'glass' : 'bg-white dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
