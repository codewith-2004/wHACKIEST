import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExplorerMode from './pages/ExplorerMode';
main
import FogMap from './components/FogMap';
import Header from './components/Header';
import Profile from './pages/Profile';

import { Settings, LogOut } from 'lucide-react';

// Placeholders
const Wanderer = () => <div className="pt-32 text-center font-bold text-brand-dark text-2xl">🗺️ Wanderer Map Loading...</div>;
const Profile = () => <div className="pt-32 text-center font-bold text-brand-dark text-2xl">👤 User Profile Loading...</div>;

function TopHeader() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [showLogout, setShowLogout] = useState(false);

  // Nav Pill Styles
  const navItemClass = (path) => 
    `px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      isActive(path) 
        ? 'bg-brand-dark text-brand-bg shadow-lg scale-105' 
        : 'text-brand-dark hover:bg-brand-dark/10'
    }`;

  return (
    <>
      {/* 1. ABSOLUTE: Greeting & Settings (Stays at the top, scrolls away) */}
      <div className="absolute top-0 left-0 right-0 z-40 px-6 py-6 flex justify-between items-start pointer-events-none">
        
        {/* Left: Greeting */}
        <div className="pointer-events-auto mt-1">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider drop-shadow-md">Good Evening,</p>
          <h1 className="text-white text-3xl font-serif font-black drop-shadow-lg leading-tight">Aayush</h1>
        </div>

        {/* Right: Settings Button */}
        <div className="pointer-events-auto relative">
          <button 
              onClick={() => setShowLogout(!showLogout)}
              className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-white/30 transition"
          >
            <Settings size={22} />
          </button>
           {/* Dropdown Menu */}
            {showLogout && (
                <div className="absolute right-0 top-14 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                    <button className="w-full text-left px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                        <LogOut size={14} /> Log Out
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* 2. FIXED: Navigation Pills (Stays on screen always) */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto flex space-x-1 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full p-1.5 shadow-2xl transition-all hover:bg-white/40">
          <Link to="/" className={navItemClass('/')}>Explore</Link>
          <Link to="/wanderer" className={navItemClass('/wanderer')}>Wanderer</Link>
          <Link to="/profile" className={navItemClass('/profile')}>Profile</Link>
        </nav>
      </div>
    </>
  );
}
main

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-brand-bg text-brand-dark font-sans selection:bg-brand-accent selection:text-white">
        <Header />
        <Routes>
          <Route path="/" element={<ExplorerMode />} />
          <Route path="/wanderer" element={<FogMap />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}