import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import sites from '../data/sites.json';
import HeroCarousel from '../components/HeroCarousel';
import SectionSlider from '../components/SectionSlider';
import QuestCard from '../components/QuestCard';
import { useGamification } from '../context/GamificationContext';
import { Map, Compass, Tent } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distance';
import PlaceDetailModal from '../components/PlaceDetailModal'; // Import the new modal
import { AnimatePresence } from 'framer-motion';

export default function ExplorerMode() {
  const location = useGeolocation();
  const chatbotRef = useRef(null);
  const navigate = useNavigate(); // Initialize hook
  const [selectedPlace, setSelectedPlace] = useState(null); // State for modal

  const calculateSiteDistance = (site) => {
    if (location.loaded && !location.error && location.coordinates.lat && location.coordinates.lng) {
      const dist = calculateDistance(
        location.coordinates.lat,
        location.coordinates.lng,
        site.lat,
        site.lng
      );
      if (dist) return `${dist} km`;
    }
    return site.distance;
  };

  const places = sites.filter(site => site.category === 'place').map(site => ({
    ...site,
    distance: calculateSiteDistance(site)
  }));
  
  const activities = sites.filter(site => site.category === 'activity').map(site => ({
    ...site,
    distance: calculateSiteDistance(site)
  }));

  const { quests, completedQuests, completeQuest } = useGamification();
  const sortedQuests = [...quests].sort((a, b) => {
    const aCompleted = completedQuests.includes(a.id);
    const bCompleted = completedQuests.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  // --- Handlers ---

  const handleNavigate = (place) => {
    setSelectedPlace(null);
    // Navigate to /wanderer (Map page) and pass the place data
    navigate('/wanderer', { 
      state: { targetPlace: place } 
    });
  };

  const handlePlanItinerary = (place) => {
    setSelectedPlace(null);
    // Open chatbot with specific prompt
    setTimeout(() => {
        chatbotRef.current?.openWithQuery(`Plan a detailed itinerary for visiting ${place.name} in Hampi.`);
    }, 300);
  };

  return (
    <div className="pb-24 bg-white">
      <style>{`::-webkit-scrollbar { display: none; }`}</style>

      {/* Pass onItemClick to open the modal */}
      <div className="relative z-0">
        <HeroCarousel sites={places} onItemClick={setSelectedPlace} />
      </div>

      <SectionSlider
        title="Places to visit"
        items={places}
        icon={Compass}
        theme="blue"
        onItemClick={setSelectedPlace} 
      />

      {/* ... Quest Section (Unchanged) ... */}
      <div className="py-8 px-6">
        <div className="flex justify-between items-center pr-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <Map size={20} />
            </div>
            <h2 className="text-brand-dark text-xl font-black tracking-tight">Available Quests</h2>
          </div>
        </div>

        <div className="overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar flex gap-6 snap-x snap-mandatory">
          {sortedQuests.map(quest => (
            <div key={quest.id} className="snap-center shrink-0 flex">
              <QuestCard
                quest={quest}
                isCompleted={completedQuests.includes(quest.id)}
                onClaim={completeQuest}
              />
            </div>
          ))}
        </div>
      </div>

      <SectionSlider
        title="Activities for you"
        items={activities}
        isActivity={true}
        icon={Tent}
        theme="green"
        onItemClick={setSelectedPlace}
      />

      <Chatbot ref={chatbotRef} />

      {/* Render Modal */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDetailModal 
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            onNavigate={handleNavigate}
            onPlan={handlePlanItinerary}
          />
        )}
      </AnimatePresence>
    </div>
  );
}