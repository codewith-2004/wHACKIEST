import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const GamificationContext = createContext();

export function GamificationProvider({ children }) {
    // --- State ---
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('hampi_xp')) || 0);
    const [level, setLevel] = useState(() => parseInt(localStorage.getItem('hampi_level')) || 1);
    const [completedQuests, setCompletedQuests] = useState(() => JSON.parse(localStorage.getItem('hampi_completed_quests')) || []);
    const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('hampi_badges')) || []);
    // Stamps: { common: 0, rare: 0, epic: 0, mythic: 0 }
    const [stamps, setStamps] = useState(() => JSON.parse(localStorage.getItem('hampi_stamps')) || { common: 0, rare: 0, epic: 0, mythic: 0 });

    // User Profile
    const [userProfile, setUserProfile] = useState(() => JSON.parse(localStorage.getItem('hampi_user_profile')) || null);

    const [allQuests, setAllQuests] = useState([]);

    useEffect(() => {
        const fetchQuests = async () => {
            if (supabase.supabaseUrl) {
                const { data, error } = await supabase.from('quests').select('*');
                if (!error && data) setAllQuests(data);
            } else {
                // Load from local JSON for development
                try {
                    const response = await fetch('/data/quests.json');
                    const data = await response.json();
                    setAllQuests(data);
                } catch (error) {
                    console.error('Error loading quests:', error);
                }
            }
        };
        fetchQuests();
    }, []);

    // Check Level Up
    useEffect(() => {
        let xpForNext = 0;
        for (let i = 1; i <= level; i++) {
            xpForNext += (i * 250) + 250;
        }

        if (xp >= xpForNext && level < 25) {
            setLevel(l => l + 1);
        }
    }, [xp, level]);


    const addXp = (amount) => {
        setXp(prev => prev + amount);
    };

    const completeQuest = (questId) => {
        if (completedQuests.includes(questId)) return;

        const quest = allQuests.find(q => q.id === questId);
        if (!quest) return;

        setCompletedQuests(prev => {
            const newCompleted = [...prev, questId];
            if (newCompleted.length > 2) {
                generateNewQuest(newCompleted);
            }
            return newCompleted;
        });

        let awardedXp = quest.xp;
        if (quest.bonus_xp) {
            awardedXp += quest.bonus_xp;
        }
        addXp(awardedXp);

        if (quest.badge) {
            if (!badges.includes(quest.badge)) {
                setBadges(prev => [...prev, quest.badge]);
            }
        }

        if (quest.stamps) {
            setStamps(prev => {
                const newStamps = { ...prev };
                Object.entries(quest.stamps).forEach(([type, count]) => {
                    newStamps[type] = (newStamps[type] || 0) + count;
                });
                return newStamps;
            });
        }

        return { xp: awardedXp, badge: quest.badge, stamps: quest.stamps };
    };

    const updateProfile = (profileData) => {
        const newProfile = { ...userProfile, ...profileData };
        setUserProfile(newProfile);
        localStorage.setItem('hampi_user_profile', JSON.stringify(newProfile));
    };

    const generateNewQuest = async (currentCompleted) => {
        console.warn("AI Generation disabled temporarily.");
        // Stubbed for stability
        /*
        try {
            // Check if API Key exists
            const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
            if (!API_KEY) return;

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Generate a unique, fun 'Discovery Quest' for Hampi...`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const jsonStr = text.replace(/```json|```/g, '').trim();
            const newQuest = JSON.parse(jsonStr);

            setDynamicQuests(prev => [...prev, newQuest]);
        } catch (error) {
            console.error("AI Quest Generation failed:", error);
        }
        */
    };

    const LEVEL_TIERS = [
        { name: "Novice Explorer", maxLevel: 5 },
        { name: "Curious Wanderer", maxLevel: 10 },
        { name: "Heritage Enthusiast", maxLevel: 15 },
        { name: "Cultural Scholar", maxLevel: 20 },
        { name: "Hampi Legend", maxLevel: 25 },
    ];

    const getLevelTitle = () => {
        const tier = LEVEL_TIERS.find(t => level <= t.maxLevel) || LEVEL_TIERS[LEVEL_TIERS.length - 1];
        return tier.name;
    };

    const getLevelProgress = () => {
        let xpStart = 0;
        for (let i = 1; i < level; i++) {
            xpStart += (i * 250) + 250;
        }
        let xpNext = xpStart + ((level * 250) + 250);
        const currentLevelXp = xp - xpStart;
        const requiredLevelXp = xpNext - xpStart;
        let percent = (currentLevelXp / requiredLevelXp) * 100;
        return Math.min(Math.max(percent, 0), 100);
    };

    const value = {
        xp,
        level,
        completedQuests,
        badges,
        stamps,
        userProfile,
        updateProfile,
        quests: allQuests,
        addXp,
        completeQuest,
        getLevelTitle,
        getLevelProgress
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
}

export const useGamification = () => useContext(GamificationContext);
