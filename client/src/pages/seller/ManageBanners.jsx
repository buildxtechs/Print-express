import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageBanners = () => {
    const { axios } = useAppContext();
    const [banners, setBanners] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [editId, setEditId] = useState(null);
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [isActive, setIsActive] = useState(true);

    const fetchBanners = async () => {
        try {
            const { data } = await axios.get('/api/banner');
            if (data.success) setBanners(data.banners);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = editId ? '/api/banner/update' : '/api/banner/add';
            const payload = { id: editId, image, title, link, isActive };

            const { data } = await axios.post(endpoint, payload);
            if (data.success) {
                toast.success(editId ? "Banner Updated" : "Banner Added");
                setShowAdd(false);
                setEditId(null);
                fetchBanners();
                resetForm();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            const { data } = await axios.post('/api/banner/delete', { id });
            if (data.success) {
                toast.success("Banner Deleted");
                fetchBanners();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (b) => {
        setEditId(b._id);
        setImage(b.image);
        setTitle(b.title || '');
        setLink(b.link || '');
        setIsActive(b.isActive);
        setShowAdd(true);
    };

    const resetForm = () => {
        setImage(''); setTitle(''); setLink(''); setIsActive(true); setEditId(null);
    };

    useEffect(() => { fetchBanners(); }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-outfit tracking-tight">Manage Banners</h2>
                    <p className="text-xs text-text-muted font-medium">Add and manage scrolling banners for the home page</p>
                </div>
                <button onClick={() => { if (showAdd) resetForm(); setShowAdd(!showAdd); }} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95">
                    {showAdd ? 'Close Editor' : '+ Add New Banner'}
                </button>
            </div>

            {showAdd && (
                <div className="card-premium p-8 max-w-2xl animate-in zoom-in-95 duration-300 border-2 border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Image URL</label>
                            <input value={image} onChange={(e) => setImage(e.target.value)} className="input-field py-3 text-sm" placeholder="Paste image URL here..." required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banner Title (Optional)</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field py-3 text-sm" placeholder="e.g. Special Offer" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Link (Optional)</label>
                                <input value={link} onChange={(e) => setLink(e.target.value)} className="input-field py-3 text-sm" placeholder="/print" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} id="isActive" className="w-4 h-4 text-blue-600 rounded" />
                            <label htmlFor="isActive" className="text-xs font-bold text-slate-600">Active on Home Page</label>
                        </div>
                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                                {loading ? 'Processing...' : editId ? 'Update Banner ⚡' : 'Publish Banner 🚀'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <p className="text-5xl mb-4">🖼️</p>
                        <p className="text-slate-400 font-bold">No banners found. Upload your first banner above.</p>
                    </div>
                ) : (
                    banners.map((b) => (
                        <div key={b._id} className="card-premium overflow-hidden group bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                            <div className="relative h-48 bg-slate-100">
                                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => handleEdit(b)} className="p-2 bg-white/90 backdrop-blur-md shadow-lg rounded-xl text-slate-700 hover:bg-white transition-all">✏️</button>
                                    <button onClick={() => handleDelete(b._id)} className="p-2 bg-red-50/90 backdrop-blur-md shadow-lg rounded-xl text-red-600 hover:bg-red-50 transition-all">🗑️</button>
                                </div>
                                {!b.isActive && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                        <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">Inactive</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-900">{b.title || 'Untitled Banner'}</h3>
                                    <p className="text-[10px] text-slate-400 font-bold font-mono truncate max-w-[200px]">{b.link || 'No Link'}</p>
                                </div>
                                <span className={`w-3 h-3 rounded-full ${b.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-slate-300'}`}></span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageBanners;
