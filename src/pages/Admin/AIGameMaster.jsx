
import React, { useState } from 'react';
import { generateGameContent } from '../../lib/gemini';
import { supabase } from '../../lib/supabaseClient';
import { Sparkles, MessageSquare, Plus, Save, Loader2, RefreshCcw } from 'lucide-react';

export default function AIGameMaster() {
    const [prompt, setPrompt] = useState('');
    const [type, setType] = useState('quest');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [savedIds, setSavedIds] = useState(new Set());

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const data = await generateGameContent(prompt, type);
            setResults(data);
        } catch (err) {
            setError(err.message || "Failed to generate content.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (item, index) => {
        if (!supabase.supabaseUrl) {
            alert("Cannot save: Supabase not connected.");
            return;
        }

        try {
            const table = type === 'quest' ? 'quests' : 'sites';
            const { error } = await supabase.from(table).insert([item]);

            if (error) throw error;

            const newSaved = new Set(savedIds);
            newSaved.add(index);
            setSavedIds(newSaved);

        } catch (err) {
            alert("Error saving: " + err.message);
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                    <Sparkles className="text-pink-500" />
                    AI Game Master
                </h2>
                <p className="text-gray-500">Describe what you want, and I'll generate game content for you.</p>
            </div>

            <div className="flex gap-6 h-full min-h-0">

                {/* Chat / Input Section */}
                <div className="w-1/3 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
                    <form onSubmit={handleGenerate} className="flex flex-col h-full gap-4">

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">I want to generate...</label>
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setType('quest')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === 'quest' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Quests
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('site')}
                                    className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === 'site' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Sites
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Prompt</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={type === 'quest' ? "Ex: Create 3 quests about finding secret temples at sunset..." : "Ex: Suggest 3 hidden nature spots near the river..."}
                                className="w-full h-full resize-none p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !prompt}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            Generate Magic
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                <div className="flex-1 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col">
                    {error && (
                        <div className="p-8 text-center text-red-500 font-medium">
                            {error}
                        </div>
                    )}

                    {!loading && results.length === 0 && !error && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <Sparkles size={40} className="opacity-20" />
                            </div>
                            <p>Results will appear here...</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                            <Loader2 size={40} className="animate-spin text-purple-500" />
                            <p className="animate-pulse">Consulting the ancient scrolls...</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-gray-700">Generated Results</h3>
                                <button onClick={() => setResults([])} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
                                    <RefreshCcw size={12} /> Clear
                                </button>
                            </div>

                            {results.map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="inline-block px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-bold uppercase mb-2">
                                                {type === 'quest' ? item.rarity : item.category}
                                            </span>
                                            <h4 className="text-xl font-bold">{item.title || item.name}</h4>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-sm font-bold text-gray-500">{item.xp} XP</div>
                                            {item.duration_days && <div className="text-xs text-gray-400">{item.duration_days} Days</div>}
                                        </div>
                                    </div>

                                    <p className="text-gray-600">{item.description}</p>

                                    <div className="pt-4 border-t border-gray-50 flex justify-end">
                                        <button
                                            onClick={() => handleSave(item, idx)}
                                            disabled={savedIds.has(idx)}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${savedIds.has(idx)
                                                    ? 'bg-green-100 text-green-700 cursor-default'
                                                    : 'bg-black text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {savedIds.has(idx) ? 'Saved' : 'Save to Database'}
                                            {savedIds.has(idx) ? <Save size={16} /> : <Plus size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
