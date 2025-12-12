
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, Save, X, Search } from 'lucide-react';

export default function QuestManager() {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(false); // Initially false to avoid blocking UI without keys
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuest, setEditingQuest] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'discovery',
        rarity: 'common',
        xp: 100,
        duration_days: 0,
        badge: ''
    });

    useEffect(() => {
        fetchQuests();
    }, []);

    const fetchQuests = async () => {
        // Check if client is configured
        if (!supabase.supabaseUrl) return;

        setLoading(true);
        const { data, error } = await supabase.from('quests').select('*');
        if (error) console.error('Error fetching quests:', error);
        else setQuests(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase.supabaseUrl) {
            alert("Supabase not connected! Add keys to .env");
            return;
        }

        const questData = {
            ...formData,
            duration_days: formData.duration_days === 0 ? null : formData.duration_days
        };

        if (editingQuest) {
            const { error } = await supabase
                .from('quests')
                .update(questData)
                .eq('id', editingQuest.id);
            if (!error) fetchQuests();
        } else {
            const { error } = await supabase
                .from('quests')
                .insert([questData]);
            if (!error) fetchQuests();
        }
        closeModal();
    };

    const deleteQuest = async (id) => {
        if (!confirm('Are you sure?')) return;
        if (!supabase.supabaseUrl) return;

        const { error } = await supabase.from('quests').delete().eq('id', id);
        if (!error) fetchQuests();
    };

    const openModal = (quest = null) => {
        if (quest) {
            setEditingQuest(quest);
            setFormData({
                title: quest.title,
                description: quest.description,
                type: quest.type,
                rarity: quest.rarity,
                xp: quest.xp,
                duration_days: quest.duration_days || 0,
                badge: quest.badge || ''
            });
        } else {
            setEditingQuest(null);
            setFormData({
                title: '',
                description: '',
                type: 'discovery',
                rarity: 'common',
                xp: 100,
                duration_days: 0,
                badge: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuest(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quest Manager</h2>
                    <p className="text-gray-500">Manage all quests in the game</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Add Quest
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Rarity</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">XP</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {quests.map((quest) => (
                                <tr key={quest.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{quest.title}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{quest.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{quest.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${quest.rarity === 'common' ? 'bg-emerald-100 text-emerald-700' :
                                                quest.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                                                    quest.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-amber-100 text-amber-700'
                                            }`}>
                                            {quest.rarity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">{quest.xp}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openModal(quest)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => deleteQuest(quest.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {quests.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                                        {supabase.supabaseUrl ? "No quests found." : "Supabase not connected. Quests will appear here."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingQuest ? 'Edit Quest' : 'New Quest'}</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all" rows="3" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 outline-none">
                                        <option value="discovery">Discovery</option>
                                        <option value="challenge">Challenge</option>
                                        <option value="photo">Photo</option>
                                        <option value="social">Social</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
                                    <select value={formData.rarity} onChange={e => setFormData({ ...formData, rarity: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 outline-none">
                                        <option value="common">Common</option>
                                        <option value="rare">Rare</option>
                                        <option value="epic">Epic</option>
                                        <option value="mythic">Mythic</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                                    <input required type="number" value={formData.xp} onChange={e => setFormData({ ...formData, xp: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                                    <input type="number" value={formData.duration_days} onChange={e => setFormData({ ...formData, duration_days: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50" placeholder="0 for unlimited" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/20 flex justify-center items-center gap-2 mt-4">
                                <Save size={20} />
                                Save Quest
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
