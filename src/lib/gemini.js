
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Fail gracefully if no key
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateGameContent = async (prompt, type = 'quest') => {
    if (!genAI) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let schemaPrompt = "";
    if (type === 'quest') {
        schemaPrompt = `
        You are an AI Game Master for a gamified travel app called "Hampi Explorer".
        Generate an array of 3 unique quests based on the user's prompt. 
        Return ONLY valid JSON.
        
        Schema for a Quest object:
        {
            "title": "String",
            "description": "String (Short, engaging)",
            "type": "discovery" | "challenge" | "photo" | "social",
            "rarity": "common" | "rare" | "epic" | "mythic",
            "xp": Number (100-2000),
            "duration_days": Number or null,
            "badge": "String (optional badge name)"
        }
        `;
    } else if (type === 'site') {
        schemaPrompt = `
        You are an AI Game Master for "Hampi Explorer".
        Generate an array of 3 unique heritage sites/activities in Hampi based on the user's prompt.
        Return ONLY valid JSON.

        Schema for a Site object:
        {
            "name": "String",
            "category": "place" | "activity",
            "description": "String",
            "distance": "String (e.g '2.5 km')",
            "xp": Number,
            "lat": Number (Approximate Hampi coordinates),
            "lng": Number (Approximate Hampi coordinates),
            "image": "/images/placeholder.png"
        }
        `;
    }

    const fullPrompt = `${schemaPrompt}\n\nUser Request: ${prompt}`;

    try {
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};
