import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Clock, MapPin, CheckCircle2, Camera, AlertCircle } from 'lucide-react';
import { calculateDistance } from '../utils/distance';

export default function QuestCard({ quest, isCompleted, onClaim, userLocation }) {
    const [status, setStatus] = React.useState('idle'); // idle, verifying, success, error, photo_ready
    const [errorMsg, setErrorMsg] = React.useState('');

    // Distance Threshold in km (e.g., 1.0km)
    const DISTANCE_THRESHOLD_KM = 1.0;

    const handleStartQuest = (e) => {
        e.stopPropagation();

        if (status === 'photo_ready') {
            setStatus('success');
            setTimeout(() => onClaim(quest.id), 1000);
            return;
        }

        setStatus('verifying');
        setErrorMsg('');

        if (!quest.lat || !quest.lng) {
            onClaim(quest.id);
            setStatus('idle');
            return;
        }

        // Force a fresh location check
        if (!navigator.geolocation) {
            setStatus('error');
            setErrorMsg("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const dist = calculateDistance(userLat, userLng, quest.lat, quest.lng);

                // Assuming 'dist' is in km
                if (dist <= DISTANCE_THRESHOLD_KM) {
                    if (quest.type === 'photo') {
                        setStatus('photo_ready');
                    } else {
                        setStatus('success');
                        setTimeout(() => onClaim(quest.id), 1000);
                    }
                } else {
                    console.log("Too far:", dist, "km");
                    setStatus('error');
                    setErrorMsg(`Too far! Go to the location (${dist}km away).`);
                }
            },
            (error) => {
                console.error("Location Error:", error);
                setStatus('error');
                setErrorMsg("Location access denied or unavailable.");
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };
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
        common: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-700/50 dark:text-emerald-100',
        rare: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-100',
        epic: 'bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-900/20 dark:border-purple-700/50 dark:text-purple-100',
        mythic: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-700/50 dark:text-amber-100',
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
            className={`relative w-80 min-h-[30rem] h-full flex flex-col justify-between rounded-3xl p-6 border-2 shadow-xl cursor-pointer overflow-hidden backdrop-blur-sm transition-colors duration-300 ${isCompleted ? 'grayscale bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400' : (rarityColors[quest.rarity] || rarityColors.common)}`}
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
                    <div className="bg-white/60 dark:bg-black/40 backdrop-blur rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider border border-white/40 dark:border-white/10 shadow-sm">
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
                    <div className="w-16 h-16 rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur flex items-center justify-center mb-4 shadow-inner border border-white/40 dark:border-white/10">
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
                                    <div key={type} className="flex items-center gap-1 bg-white/40 dark:bg-black/20 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
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
                    onClick={handleStartQuest}
                    disabled={isCompleted || status === 'verifying'}
                    style={{ backgroundColor: isCompleted ? '#9ca3af' : rarityAccents[quest.rarity] }}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 relative overflow-hidden`}
                >
                    {isCompleted ? (
                        <>Completed <CheckCircle2 size={20} /></>
                    ) : status === 'verifying' ? (
                        <>Verifying... <MapPin size={20} className="animate-bounce" /></>
                    ) : status === 'photo_ready' ? (
                        <>Take Photo <Camera size={20} /></>
                    ) : status === 'error' ? (
                        <span className="text-xs">{errorMsg || "Try Again"}</span>
                    ) : (
                        <>Start Quest <MapPin size={20} /></>
                    )}
                </motion.button>

                {/* Status Message Overlay */}
                <AnimatePresence>
                    {status === 'photo_ready' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-20 left-6 right-6 bg-white/90 backdrop-blur text-brand-dark p-2 rounded-lg text-xs font-bold text-center shadow-lg border border-brand-accent/20"
                        >
                            <span className="flex items-center justify-center gap-1 text-green-600">
                                <CheckCircle2 size={12} /> You're here!
                            </span>
                            Tap button to capture moment!
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
}
