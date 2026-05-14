import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, PiggyBank, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: Receipt, label: 'Exp', path: '/expenses' },
    { icon: Wallet, label: 'Inc', path: '/income' },
    { icon: PiggyBank, label: 'Budget', path: '/budget' },
    { icon: Settings, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 px-6 py-2 pb-safe">
            <div className="flex items-center justify-between">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                                isActive
                                    ? 'text-primary-500 dark:text-primary-400'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
