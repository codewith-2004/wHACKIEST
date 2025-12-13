import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import { Trophy, Medal, Map, Star, Award, Zap, Crown, Flame, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
    const { xp, level, getLevelTitle, getLevelProgress, badges, completedQuests, stamps, userProfile } = useGamification();
    const progress = getLevelProgress();

    const [showQuestModal, setShowQuestModal] = useState(false);

    // Color themes for different sections to make them bold
    const themes = {
        xp: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', icon: 'bg-amber-500' },
        quests: { bg: 'bg-rose-100', border: 'border-rose-500', text: 'text-rose-700', icon: 'bg-rose-500' },
        badges: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', icon: 'bg-blue-500' },
        stamps: { bg: 'bg-emerald-100', border: 'border-emerald-500', text: 'text-emerald-700', icon: 'bg-emerald-500' },
    };

    return (
        <div className="min-h-screen bg-[#FAF3E1] dark:bg-brand-dark-bg pt-28 pb-12 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* --- HERO SECTION: PLAYER CARD --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-brand-dark-card dark:border-brand-dark-text/10 rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] border-4 border-brand-dark relative overflow-hidden transition-colors duration-300"
                >
                    {/* Decorative Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        {/* Avatar Box */}
                        <div className="relative group">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -2 }}
                                className="w-36 h-36 rounded-3xl bg-brand-accent flex items-center justify-center text-6xl border-4 border-brand-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                            >
                                <span className="group-hover:scale-110 transition-transform duration-300">{userProfile?.avatar || '🤠'}</span>
                            </motion.div>
                            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-brand-dark font-black text-xl px-4 py-2 rounded-xl border-4 border-brand-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-3">
                                LVL {level}
                            </div>
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 w-full text-center md:text-left space-y-3">
                            <div>
                                <h1 className="text-4xl font-black text-brand-dark dark:text-brand-dark-text tracking-tight transition-colors">{userProfile?.username || 'Explorer'}</h1>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg border-2 border-purple-200 mt-2 font-bold text-sm uppercase tracking-wide">
                                    <Crown size={16} />
                                    {getLevelTitle()}
                                </div>
                            </div>

                            {/* XP Progress Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <span>XP Progress</span>
                                    <span>{Math.floor(progress)}% to Lvl {level + 1}</span>
                                </div>
                                <div className="h-6 bg-gray-200 rounded-full border-2 border-brand-dark overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.5, type: "spring" }}
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                    >
                                        {/* Striped pattern overlay */}
                                        <div className="w-full h-full opacity-30" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                                    </motion.div>
                                </div>
                                <div className="text-right text-xs font-bold text-brand-accent">
                                    {xp} XP Earned Total
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- STATS DASHBOARD --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatBox
                        icon={<Flame size={28} className="text-white" />}
                        label="Total XP"
                        value={xp}
                        theme={themes.xp}
                        delay={0.1}
                    />
                    <StatBox
                        icon={<Trophy size={28} className="text-white" />}
                        label="Quests"
                        value={completedQuests.length}
                        theme={themes.quests}
                        delay={0.2}
                        onClick={() => setShowQuestModal(true)}
                    />
                    <StatBox
                        icon={<Medal size={28} className="text-white" />}
                        label="Badges"
                        value={badges.length}
                        theme={themes.badges}
                        delay={0.3}
                    />
                    <StatBox
                        icon={<Star size={28} className="text-white" />}
                        label="Stamps"
                        value={stamps ? Object.values(stamps).reduce((a, b) => a + b, 0) : 0}
                        theme={themes.stamps}
                        delay={0.4}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- STAMPS COLLECTION --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-brand-dark-card dark:border-brand-dark-text/10 rounded-3xl p-6 border-4 border-gray-200 shadow-xl transition-colors duration-300"
                    >
                        <h2 className="text-2xl font-black text-brand-dark dark:text-brand-dark-text mb-6 flex items-center gap-3 transition-colors">
                            <div className="p-2 bg-purple-500 rounded-lg text-white border-2 border-brand-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Star size={20} />
                            </div>
                            Stamps
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {stamps && Object.entries(stamps).map(([type, count], idx) => (
                                <div key={type} className={`
                                    relative p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                                    ${count > 0 ? 'bg-purple-50 border-purple-200 opacity-100' : 'bg-gray-50 border-dashed border-gray-300 opacity-60'}
                                `}>
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center mb-1 text-xl border-2 border-white shadow-md
                                        ${type === 'common' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                                            type === 'rare' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                                                type === 'epic' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                                                    'bg-gradient-to-br from-amber-400 to-amber-600'}
                                    `}>
                                        {count > 0 ? '✨' : '🔒'}
                                    </div>
                                    <span className="font-bold uppercase text-[10px] tracking-widest text-gray-500">{type}</span>
                                    <span className="text-2xl font-black text-brand-dark dark:text-brand-dark-text">{count}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* --- BADGES COLLECTION --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white dark:bg-brand-dark-card dark:border-brand-dark-text/10 rounded-3xl p-6 border-4 border-gray-200 shadow-xl transition-colors duration-300"
                    >
                        <h2 className="text-2xl font-black text-brand-dark dark:text-brand-dark-text mb-6 flex items-center gap-3 transition-colors">
                            <div className="p-2 bg-brand-accent rounded-lg text-white border-2 border-brand-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Award size={20} />
                            </div>
                            Badges
                        </h2>

                        {badges.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {badges.map((badge, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ y: -5 }}
                                        className="bg-orange-50 rounded-xl p-3 border-2 border-orange-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-300 hover:shadow-lg transition-all"
                                    >
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-orange-200 shadow-sm mb-2 text-2xl group-hover:scale-110 transition-transform">
                                            🎖️
                                        </div>
                                        <span className="font-bold text-xs text-brand-dark dark:text-brand-dark-text leading-tight line-clamp-2 transition-colors">{badge}</span>
                                    </motion.div>
                                ))}
                                {/* Empty slots fillers for visual balance */}
                                {[...Array(Math.max(0, 6 - badges.length))].map((_, i) => (
                                    <div key={`empty-${i}`} className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center opacity-50">
                                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6">
                                <span className="text-4xl mb-2 opacity-50">🛑</span>
                                <p className="text-gray-400 font-bold">No badges earned yet.</p>
                                <p className="text-xs text-gray-400 mt-1">Go explore Hampi to earn your first one!</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Quest Modal */}
                {showQuestModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowQuestModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-brand-dark flex items-center gap-3">
                                    <div className="p-2 bg-rose-500 rounded-lg text-white border-2 border-brand-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        <Trophy size={20} />
                                    </div>
                                    Completed Quests ({completedQuests.length})
                                </h2>
                                <button
                                    onClick={() => setShowQuestModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {completedQuests.length > 0 ? (
                                <div className="space-y-3">
                                    {completedQuests.map((questId) => {
                                        const quest = quests.find(q => q.id === questId);
                                        return quest ? (
                                            <div key={questId} className="bg-rose-50 rounded-xl p-4 border-2 border-rose-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center text-white">
                                                        <Trophy size={16} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-brand-dark">{quest.title}</h3>
                                                        <p className="text-sm text-gray-600">{quest.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">No quests completed yet.</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

// Reusable colorful stat box
const StatBox = ({ icon, label, value, theme, delay, onClick }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200 }}
        whileHover={{ y: -5 }}
        className={`${theme.bg} p-5 rounded-2xl border-b-4 ${theme.border} flex flex-col items-start justify-between h-32 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${theme.icon} opacity-20`} />

        <div className={`${theme.icon} p-2 rounded-lg shadow-sm relative z-10 border border-white/20`}>
            {icon}
        </div>

        <div className="relative z-10">
            <div className={`text-3xl font-black ${theme.text}`}>{value}</div>
            <div className={`text-xs font-bold ${theme.text} uppercase tracking-wider opacity-80`}>{label}</div>
        </div>
    </motion.div>
);