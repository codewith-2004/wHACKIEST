import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroCarousel({ sites }) {
  const [index, setIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sites.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sites.length]);

  return (
    // CHANGE 1: Changed h-64 to h-[75vh] to make it BIG like your sketch
    <div className="relative w-full h-[75vh] overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={index}
          src={sites[index].image}
          alt={sites[index].name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Top Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Fade to Canvas (White) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex items-end p-8 pb-16">
        <div className="mb-4 relative z-10">
          <span className="text-brand-accent text-xs font-bold tracking-widest uppercase mb-2 block bg-black/40 w-fit px-2 py-1 rounded backdrop-blur-md">
            Featured Site
          </span>
          <h2 className="text-white text-4xl font-serif font-bold leading-tight drop-shadow-lg">{sites[index].name}</h2>
          <p className="text-white/90 text-sm mt-2 max-w-xs line-clamp-2 drop-shadow-md font-medium">{sites[index].description}</p>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 flex space-x-2">
        {sites.map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-300 rounded-full shadow-lg ${i === index ? 'bg-brand-accent w-8 h-2' : 'bg-white/50 w-2 h-2'}`}
          />
        ))}
      </div>
    </div>
  );
}