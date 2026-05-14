import { useTheme } from '../../context/ThemeContext';
import { Menu, Sun, Moon, Bell } from 'lucide-react';

export function Navbar({ onMenuClick }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md md:hidden border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
                    <Menu size={24} />
                </button>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    SpendWise
                </span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Bell size={20} />
                </button>
            </div>
        </header>
    );
}
