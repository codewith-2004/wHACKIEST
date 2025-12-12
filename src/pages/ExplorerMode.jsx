import React, { useState, useRef } from 'react';
import sites from '../data/sites.json';
import HeroCarousel from '../components/HeroCarousel';
import SectionSlider from '../components/SectionSlider';
import QuestCard from '../components/QuestCard';
import { useGamification } from '../context/GamificationContext';
import { Bot, Map } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import PlaceDetailModal from '../components/PlaceDetailModal';
import { ArrowRight, Star } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../utils/distance';

export default function ExplorerMode() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const location = useGeolocation();
  const chatbotRef = useRef(null);

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
  // Show all quests, but sort incomplete ones first
  const sortedQuests = [...quests].sort((a, b) => {
    const aCompleted = completedQuests.includes(a.id);
    const bCompleted = completedQuests.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  const handlePlanItinerary = (placeName) => {
    setSelectedPlace(null);
    if (chatbotRef.current) {
      chatbotRef.current.openWithQuery(`Plan a trip to ${placeName}`);
    }
  };

  return (
    <div className="pb-24 bg-white">
      {/* Style tag to hide scrollbars on Chrome/Safari */}
      <style>{`
            ::-webkit-scrollbar {
                display: none;
            }
        `}</style>


      <div className="relative z-0">
        <HeroCarousel sites={places} />
      </div>

      <SectionSlider
        title="Places to visit"
        items={places}
        onSelect={(place) => setSelectedPlace(place)}
      />

      {/* Active Quests Section - Horizontal Scroll */}
      <div className="py-8 px-6">
        <div className="flex items-center gap-2 mb-6">
          <Map className="text-brand-accent" />
          <h2 className="text-2xl font-serif font-bold text-gray-900">Available Quests</h2>
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
          {sortedQuests.length === 0 && (
            <div className="w-full text-center py-10 text-gray-500 italic">
              All currently available quests completed!
            </div>
          )}
        </div>
      </div>

      <SectionSlider
        title="Activities nearby"
        items={activities}
        isActivity={true}
        onSelect={(place) => setSelectedPlace(place)}
      />

      <Chatbot ref={chatbotRef} />

      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
        onPlanItinerary={handlePlanItinerary}
      />
    </div>
  );
}