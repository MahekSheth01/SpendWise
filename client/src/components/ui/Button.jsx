import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
    const variants = {
        primary: 'bg-primary-400 hover:bg-primary-500 text-white shadow-md shadow-primary-400/20', // Updated to match config
        secondary: 'bg-secondary-400 hover:bg-secondary-500 text-white shadow-md shadow-secondary-400/20',
        outline: 'border-2 border-primary-400 text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
        ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={twMerge(
                'rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
