
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, FolderOpen, LogOut, Sparkles } from 'lucide-react';
import { migrateData } from '../../lib/migrate';

export default function AdminLayout() {
    const location = useLocation();

    const navItems = [
        { path: '/admin/quests', icon: FolderOpen, label: 'Quests' },
        { path: '/admin/sites', icon: Map, label: 'Sites' },
        { path: '/admin/ai-master', icon: Sparkles, label: 'AI Master' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <button onClick={() => migrateData().then(alert)} className="mt-2 text-xs text-gray-400 hover:text-black underline cursor-pointer">
                        Migrate Mock Data
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                ? 'bg-orange-50 text-orange-600 font-bold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
