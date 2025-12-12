import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Trophy, Star, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function QuestCard({ quest, isCompleted, onClaim }) {
    // 3D Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    // Spring physics for smooth tilt
    const springConfig = { stiffness: 300, damping: 30 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rarityColors = {
        common: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        rare: 'bg-blue-50 border-blue-200 text-blue-900',
        epic: 'bg-purple-50 border-purple-200 text-purple-900',
        mythic: 'bg-amber-50 border-amber-200 text-amber-900',
    };

    const rarityAccents = {
        common: '#10b981',
        rare: '#3b82f6',
        epic: '#a855f7',
        mythic: '#f59e0b',
    };

    return (
        <motion.div
            style={{
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d"
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`relative w-80 min-h-[30rem] h-full flex flex-col justify-between rounded-3xl p-6 border-2 shadow-xl cursor-pointer overflow-hidden backdrop-blur-sm ${isCompleted ? 'grayscale bg-gray-100 border-gray-300' : (rarityColors[quest.rarity] || rarityColors.common)}`}
        >
            {/* Background Decorative Layer */}
            <div
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: rarityAccents[quest.rarity] }}
            />

            {/* 3D Content Container */}
            <div style={{ transform: "translateZ(30px)" }} className="relative z-10 h-full flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-white/60 backdrop-blur rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider border border-white/40 shadow-sm">
                        {quest.rarity}
                    </div>
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-green-500 rounded-full p-1"
                        >
                            <CheckCircle2 color="white" size={20} />
                        </motion.div>
                    )}
                </div>

                {/* Title & Icon */}
                <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/50 backdrop-blur flex items-center justify-center mb-4 shadow-inner border border-white/40">
                        {quest.type === 'photo' ? <Star size={32} strokeWidth={1.5} /> : <Trophy size={32} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-2xl font-black leading-tight mb-2 drop-shadow-sm">{quest.title}</h3>
                    <p className="text-sm font-medium opacity-80 leading-relaxed">{quest.description}</p>
                </div>

                {/* Requirements / Stats */}
                <div className="space-y-3 mt-auto mb-6">
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-75">
                        <Clock size={16} />
                        <span>{quest.duration_days ? `${quest.duration_days} Days` : 'No Time Limit'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-75">
                        <Trophy size={16} />
                        <span className="flex flex-col">
                            <span>{quest.xp} XP {quest.bonus_xp > 0 && <span className="text-yellow-600 ml-1">(+{quest.bonus_xp} Bonus)</span>}</span>
                        </span>
                    </div>

                    {/* Stamps Display */}
                    {quest.stamps && (
                        <div className="flex gap-2 mt-2">
                            {Object.entries(quest.stamps).map(([type, count]) => (
                                count > 0 && (
                                    <div key={type} className="flex items-center gap-1 bg-white/40 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                                        <div className={`w-2 h-2 rounded-full ${type === 'common' ? 'bg-emerald-400' : type === 'rare' ? 'bg-blue-400' : type === 'epic' ? 'bg-purple-400' : 'bg-amber-400'}`} />
                                        <span>{count} {type} Stamp{count > 1 ? 's' : ''}</span>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => !isCompleted && onClaim(quest.id)}
                    disabled={isCompleted}
                    style={{ backgroundColor: isCompleted ? '#9ca3af' : rarityAccents[quest.rarity] }}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2`}
                >
                    {isCompleted ? 'Completed' : 'Start Quest'}
                </motion.button>

            </div>
        </motion.div>
    );
}
