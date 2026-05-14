import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Input({ className, label, error, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700',
                    'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100',
                    'focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none transition-all placeholder:text-gray-400',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
