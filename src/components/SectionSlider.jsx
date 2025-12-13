import React, { useState } from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';

export default function SectionSlider({ title, items, isActivity = false, onItemClick, icon: Icon, theme = 'orange' }) {

    const themes = {
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
        green: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
        rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
    };

    const currentTheme = themes[theme] || themes.orange;

    const [showAll, setShowAll] = useState(false);

    return (
        <div className="mt-8 pl-6 relative z-10">
            <div className="flex justify-between items-center pr-6 mb-4">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className={`p-2 rounded-lg ${currentTheme.bg} ${currentTheme.text}`}>
                            <Icon size={20} />
                        </div>
                    )}
                    <h3 className="text-brand-dark text-xl font-black tracking-tight">{title}</h3>
                </div>
                <span 
                    className={`text-xs font-bold uppercase cursor-pointer hover:underline ${currentTheme.text}`}
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? 'View Less' : 'View All'}
                </span>
            </div>


            <div className="flex overflow-x-auto gap-5 pb-8 pr-6 snap-x hide-scrollbar">
                {items && items.map((item) => (
                    <div
                        key={item.id}
                        // INCREASED HEIGHT: min-w is now 240px, and image height is h-40
                        className="min-w-[240px] bg-[#FAF3E1] rounded-2xl p-3 shadow-lg flex-shrink-0 snap-center border border-brand-dark/5 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between"
                    >
                        <div>
                            {/* Image Section (Taller now: h-40) */}
                            <div className="h-40 w-full rounded-xl overflow-hidden mb-3 relative">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <div className="bg-brand-dark/70 text-brand-bg text-[10px] px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                        {isActivity && <Star size={8} className="text-yellow-400 fill-yellow-400" />}
                                        {item.distance}

                                    </div>
                                </div>

                                {/* Card Details */}
                                <h4 className="font-bold text-brand-dark text-lg leading-tight font-serif">{item.name}</h4>
                                <p className="text-xs text-brand-dark/60 mt-1 line-clamp-2">{item.description}</p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-4">
                                <button
                                    onClick={() => onSelect && onSelect(item)}
                                    className={`w-full py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition flex justify-center items-center gap-2 ${isActivity ? 'bg-brand-dark text-white' : 'bg-brand-accent text-white hover:bg-[#ff8547]'}`}
                                >
                                    {isActivity ? 'Book Now' : 'More Details'} <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex overflow-x-auto gap-5 pb-8 pr-6 snap-x hide-scrollbar">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            // INCREASED HEIGHT: min-w is now 240px, and image height is h-40
                            className="min-w-[240px] bg-[#FAF3E1] rounded-2xl p-3 shadow-lg flex-shrink-0 snap-center border border-brand-dark/5 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between"
                        >
                            <div>
                                {/* Image Section (Taller now: h-40) */}
                                <div className="h-40 w-full rounded-xl overflow-hidden mb-3 relative">
                                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <div className="bg-brand-dark/70 text-brand-bg text-[10px] px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                            {isActivity && <Star size={8} className="text-yellow-400 fill-yellow-400" />}
                                            {item.distance}
                                        </div>
                                        <button className="bg-white/90 p-1 rounded-full text-brand-accent shadow-sm hover:scale-110 active:scale-95 transition">
                                            <Heart size={14} />
                                        </button>
                                    </div>
                                </div>

                        {/* Action Button */}
                        <div className="mt-4">
                            <button
                                onClick={() => onItemClick && onItemClick(item)}
                                className={`w-full py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition flex justify-center items-center gap-2 ${isActivity ? 'bg-brand-dark text-white' : 'bg-brand-accent text-white hover:bg-[#ff8547]'}`}
                            >
                                {isActivity ? 'Book Now' : 'More Details'} <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}