
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, MapPin, Sparkles, Navigation } from 'lucide-react';

export default function PlaceDetailModal({ place, onClose, onPlanItinerary }) {
    if (!place) return null;

    const [isFlipped, setIsFlipped] = useState(false);

    // Initial animation variants for the card entry
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", damping: 25, stiffness: 300 }
        },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
    };

    // Flip animation variants
    const flipVariants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
                {/* Blurred Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* 3D Container */}
                <div className="relative w-full max-w-sm aspect-[3/4] perspective-1000 z-50 pointer-events-none">
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="w-full h-full relative preserve-3d transition-all duration-700 pointer-events-auto"
                        style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                        }}
                    >
                        {/* FRONT FACE */}
                        <div className="absolute inset-0 backface-hidden bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                            <div className="h-2/3 relative">
                                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={onClose}
                                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                                    <h2 className="text-3xl font-black text-white font-serif mb-1">{place.name}</h2>
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                        <MapPin size={16} className="text-brand-accent" />
                                        {place.distance || "Unknown distance"} away
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white relative">
                                <p className="text-center text-gray-600 mb-6 px-4 line-clamp-3">
                                    {place.description}
                                </p>

                                <button
                                    onClick={() => setIsFlipped(true)}
                                    className="bg-brand-accent text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 active:scale-95 transition flex items-center gap-2"
                                >
                                    More Details <Sparkles size={18} />
                                </button>
                            </div>
                        </div>

                        {/* BACK FACE */}
                        <div
                            className="absolute inset-0 backface-hidden bg-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col p-8"
                            style={{ transform: "rotateY(180deg)" }}
                        >
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={onClose}
                                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsFlipped(false)}
                                className="absolute top-4 left-4 text-white/50 hover:text-white text-sm font-bold flex items-center gap-1"
                            >
                                ← Back
                            </button>

                            <div className="mt-12 space-y-6">
                                <div>
                                    <h3 className="text-brand-accent font-bold uppercase tracking-wider text-xs mb-2">About the Place</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm">
                                        {place.detailed_description || place.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-brand-accent font-bold uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
                                        <Clock size={14} /> Best Time to Visit
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {place.best_time || "Early Morning (6:00 AM - 9:00 AM) or Sunset"}
                                    </p>
                                </div>

                                <div className="pt-4 mt-auto">
                                    <button
                                        onClick={() => onPlanItinerary(place.name)}
                                        className="w-full bg-white text-brand-dark py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 active:scale-95 transition flex items-center justify-center gap-3"
                                    >
                                        <Navigation size={20} className="text-brand-accent" />
                                        Create Itinerary
                                    </button>
                                    <p className="text-center text-gray-500 text-[10px] mt-3">
                                        Powered by AI Game Master
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
