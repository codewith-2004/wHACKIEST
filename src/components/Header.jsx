import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';

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
        <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
            {/* 
           Redesigned Pill Navigation 
           - pointer-events-auto ensures the pill itself is clickable
           - backdrop-blur and semi-transparent white matches the reference
       */}
            <nav className="pointer-events-auto flex items-center bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-full p-1.5 gap-1">
                <Link to="/" className={navItemClass('/')}>Explore</Link>
                {/* Wanderer Button (Center of Pill) */}
                <Link to="/wanderer" className={navItemClass('/wanderer')}>Wanderer</Link>
                <Link to="/profile" className={navItemClass('/profile')}>Profile</Link>
            </nav>
        </div>
    );
}
