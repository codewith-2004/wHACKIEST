import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

export default function SectionSlider({ title, items, isActivity = false }) {
    return (
        <div className="mt-8 pl-6 relative z-10">
            <div className="flex justify-between items-end pr-6 mb-4">
                <h3 className="text-brand-dark text-xl font-bold font-serif">{title}</h3>
                <span className="text-brand-accent text-xs font-bold uppercase cursor-pointer hover:underline">View All</span>
            </div>

            <div className="flex overflow-x-auto gap-5 pb-8 pr-6 snap-x hide-scrollbar">
                {items.map((item) => (
                    <div
                        key={item.id}
                        // INCREASED HEIGHT: min-w is now 240px, and image height is h-40
                        className="min-w-[240px] bg-brand-card rounded-2xl p-3 shadow-lg flex-shrink-0 snap-center border border-brand-dark/5 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between"
                    >
                        <div>
                            {/* Image Section (Taller now: h-40) */}
                            <div className="h-40 w-full rounded-xl overflow-hidden mb-3 relative">
                                <img src={item.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute top-2 right-2 bg-brand-dark/70 text-brand-bg text-[10px] px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
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
                            <button className={`w-full py-2 rounded-lg text-sm font-bold shadow-md active:scale-95 transition flex justify-center items-center gap-2 ${isActivity ? 'bg-brand-dark text-white' : 'bg-brand-accent text-white hover:bg-[#ff8547]'}`}>
                                {isActivity ? 'Book Now' : 'Start Quest'} <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
