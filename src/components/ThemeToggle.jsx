import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors duration-200 
                 text-brand-dark hover:bg-brand-dark/10
                 dark:text-brand-bg dark:hover:bg-brand-bg/10"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
