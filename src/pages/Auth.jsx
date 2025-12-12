import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuth = (e) => {
        e.preventDefault();
        // Simulate Authentication
        localStorage.setItem('isAuthenticated', 'true');
        // Dispatch a custom event or context update if needed, 
        // but for now simple localstorage + navigate
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full bg-[#FAF3E1] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#fdbb74]/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#818cf8]/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl w-full h-[600px] bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 flex overflow-hidden relative z-10">

                {/* Left Side: Key Visual (Dynamic) */}
                <div className="w-1/2 relative hidden md:block overflow-hidden transition-all duration-500">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            src="/images/heritage-explorer.png"
                            className="absolute inset-0 w-full h-full object-cover"
                            alt="Auth Visual"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
                        <h2 className="text-4xl font-serif font-bold mb-4">{isLogin ? "Welcome Back, Explorer." : "Begin Your Quest."}</h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            {isLogin
                                ? "Continue your journey through history. Your next discovery awaits."
                                : "Join the gamified expedition to uncover the secrets of ancient civilizations."}
                        </p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative">

                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black font-serif text-gray-800 mb-2">HERITAGE QUEST</h1>
                        <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Gamified Explorer Edition</p>
                    </div>

                    {/* Toggle */}
                    <div className="flex bg-white/50 p-1 rounded-full mb-8 relative w-fit mx-auto shadow-inner">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 z-10 relative ${isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`px-8 py-2 rounded-full text-sm font-bold transition-all duration-300 z-10 relative ${!isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Sign Up
                        </button>

                        {/* Sliding Pill */}
                        <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-dark rounded-full transition-all duration-300 shadow-lg ${isLogin ? 'left-1' : 'left-[calc(50%+0px)]'}`} />
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <AnimatePresence>
                            {!isLogin && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white/60 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-brand-accent transition-colors">
                                        <User size={18} className="text-gray-400" />
                                        <input type="text" placeholder="Full Name" className="bg-transparent border-none outline-none text-gray-800 w-full placeholder-gray-500" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="bg-white/60 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-brand-accent transition-colors">
                            <Mail size={18} className="text-gray-400" />
                            <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none text-gray-800 w-full placeholder-gray-500" />
                        </div>

                        <div className="bg-white/60 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-brand-accent transition-colors">
                            <Lock size={18} className="text-gray-400" />
                            <input type="password" placeholder="Password" className="bg-transparent border-none outline-none text-gray-800 w-full placeholder-gray-500" />
                        </div>

                        <button type="submit" className="w-full bg-brand-accent text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 group">
                            {isLogin ? "Resume Adventure" : "Create Account"}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        By continuing, you agree to our Terms of Service <br /> and Privacy Policy.
                    </p>
                </div>

            </div>
        </div>
    );
}
