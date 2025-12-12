import React from 'react';
import sites from '../data/sites.json';
import HeroCarousel from '../components/HeroCarousel';

import SectionSlider from '../components/SectionSlider';
import { Bot } from 'lucide-react';

import Chatbot from '../components/Chatbot';
import { ArrowRight, Star } from 'lucide-react';


export default function ExplorerMode() {
  const places = sites.filter(site => site.category === 'place');
  const activities = sites.filter(site => site.category === 'activity');




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
      <SectionSlider title="Activities nearby" items={activities} isActivity={true} />

      {/* Floating Chatbot */}



      <Chatbot />
    </div>
  );
}