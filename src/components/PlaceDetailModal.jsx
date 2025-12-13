import React from 'react';
import { X, Navigation, Sparkles, Clock, Sun, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaceDetailModal = ({ place, onClose, onNavigate, onPlan }) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
      />

      {/* Card */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden pointer-events-auto max-h-[90vh] flex flex-col relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-all"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 shrink-0">
          <img 
            src={place.image} 
            alt={place.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent" />
          
          <div className="absolute bottom-4 left-6">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
              {place.category}
            </span>
            <h2 className="text-3xl font-black text-gray-900 leading-none">{place.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mt-1 font-medium">
              <MapPin size={14} className="text-blue-500" />
              <span>{place.distance || 'Calculating...'} away</span>
            </div>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 pt-2 overflow-y-auto">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <Clock size={16} />
                <span className="text-xs font-black uppercase">Open Hours</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{place.business_hours || "Open 24 Hours"}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100">
              <div className="flex items-center gap-2 text-yellow-600 mb-1">
                <Sun size={16} />
                <span className="text-xs font-black uppercase">Best Time</span>
              </div>
              <p className="text-sm font-semibold text-gray-800">{place.best_time || "Morning"}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About this place</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {place.detailed_description || place.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button 
              onClick={() => onNavigate(place)}
              className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-bold transition-all active:scale-95"
            >
              <Navigation size={20} />
              Navigate
            </button>
            <button 
              onClick={() => onPlan(place)}
              className="flex items-center justify-center gap-2 bg-brand-accent text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95"
            >
              <Sparkles size={20} />
              Plan Itinerary
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceDetailModal;