import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

export default function Header() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [showLogout, setShowLogout] = useState(false);

    const navItemClass = (path) =>
        `px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive(path)
            ? 'bg-brand-dark text-brand-bg shadow-lg scale-105'
            : 'text-brand-dark hover:bg-brand-dark/10'
        }`;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto mt-1">
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider drop-shadow-md">Good Evening,</p>
                <h1 className="text-white text-3xl font-serif font-black drop-shadow-lg leading-tight">Aayush</h1>
            </div>

            <div className="pointer-events-auto absolute left-1/2 transform -translate-x-1/2 top-6">
                <nav className="flex space-x-1 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full p-1.5 shadow-2xl">
                    <Link to="/" className={navItemClass('/')}>Explore</Link>
                    <Link to="/wanderer" className={navItemClass('/wanderer')}>Wanderer</Link>
                    <Link to="/profile" className={navItemClass('/profile')}>Profile</Link>
                </nav>
            </div>

            <div className="pointer-events-auto relative">
                <button
                    onClick={() => setShowLogout(!showLogout)}
                    className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-white/30 transition"
                >
                    <Settings size={22} />
                </button>
                {showLogout && (
                    <div className="absolute right-0 top-14 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-1">
                        <button className="w-full text-left px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                            <LogOut size={14} /> Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
