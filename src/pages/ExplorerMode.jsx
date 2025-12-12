import React from 'react';
import sites from '../data/sites.json';
import HeroCarousel from '../components/HeroCarousel';

import SectionSlider from '../components/SectionSlider';
import QuestCard from '../components/QuestCard';
import { useGamification } from '../context/GamificationContext';
import { Bot, Map } from 'lucide-react';

import Chatbot from '../components/Chatbot';
import { ArrowRight, Star } from 'lucide-react';


export default function ExplorerMode() {
  const places = sites.filter(site => site.category === 'place');
  const activities = sites.filter(site => site.category === 'activity');

  const { quests, completedQuests, completeQuest } = useGamification();
  // Show all quests, but sort incomplete ones first
  const sortedQuests = [...quests].sort((a, b) => {
    const aCompleted = completedQuests.includes(a.id);
    const bCompleted = completedQuests.includes(b.id);
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });




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

      <SectionSlider title="Places near by" items={places} />

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

      <SectionSlider title="Activities nearby" items={activities} isActivity={true} />

      <Chatbot />
    </div>
  );
}