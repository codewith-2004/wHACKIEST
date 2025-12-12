
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit, Trash2, Save, X, Search, Image as ImageIcon } from 'lucide-react';

export default function SiteManager() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSite, setEditingSite] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'place',
        description: '',
        distance: '',
        xp: 50,
        lat: 15.3350,
        lng: 76.4600,
        image: '/images/placeholder.png'
    });

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        if (!supabase.supabaseUrl) return;

        setLoading(true);
        const { data, error } = await supabase.from('sites').select('*');
        if (error) console.error('Error fetching sites:', error);
        else setSites(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase.supabaseUrl) {
            alert("Supabase not connected!");
            return;
        }

        if (editingSite) {
            const { error } = await supabase.from('sites').update(formData).eq('id', editingSite.id);
            if (!error) fetchSites();
        } else {
            const { error } = await supabase.from('sites').insert([formData]);
            if (!error) fetchSites();
        }
        closeModal();
    };

    const deleteSite = async (id) => {
        if (!confirm('Are you sure?')) return;
        if (!supabase.supabaseUrl) return;
        const { error } = await supabase.from('sites').delete().eq('id', id);
        if (!error) fetchSites();
    };

    const openModal = (site = null) => {
        if (site) {
            setEditingSite(site);
            setFormData(site);
        } else {
            setEditingSite(null);
            setFormData({
                name: '',
                category: 'place',
                description: '',
                distance: '0.0 km',
                xp: 50,
                lat: 15.3350,
                lng: 76.4600,
                image: '/images/placeholder.png'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSite(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Site Manager</h2>
                    <p className="text-gray-500">Manage heritage sites and activities</p>
                </div>
                <button onClick={() => openModal()} className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
                    <Plus size={20} />
                    Add Site
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sites.map(site => (
                        <div key={site.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="h-40 bg-gray-200 relative">
                                <img src={site.image} alt={site.name} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400?text=No+Image'} />
                                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase">{site.category}</div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{site.description}</p>

                                <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-4">
                                    <span>XP: {site.xp}</span>
                                    <span>{site.distance}</span>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                                    <button onClick={() => openModal(site)} className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Edit</button>
                                    <button onClick={() => deleteSite(site.id)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {sites.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                            {supabase.supabaseUrl ? "No sites found." : "Supabase not connected. Sites will appear here."}
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingSite ? 'Edit Site' : 'New Site'}</h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 outline-none">
                                        <option value="place">Place</option>
                                        <option value="activity">Activity</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all" rows="3" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="flex-1 rounded-lg border-gray-300 p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all" />
                                    <button type="button" className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200"><ImageIcon size={20} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">XP Reward</label>
                                    <input required type="number" value={formData.xp} onChange={e => setFormData({ ...formData, xp: parseInt(e.target.value) })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance Text</label>
                                    <input type="text" value={formData.distance} onChange={e => setFormData({ ...formData, distance: e.target.value })} className="w-full rounded-lg border-gray-300 p-2.5 bg-gray-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input required type="number" step="any" value={formData.lat} onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="w-full rounded-lg border-gray-300 p-2.5 bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input required type="number" step="any" value={formData.lng} onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="w-full rounded-lg border-gray-300 p-2.5 bg-white" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-black/20 flex justify-center items-center gap-2 mt-4">
                                <Save size={20} />
                                Save Site
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
