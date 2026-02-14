import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ManageServices = () => {
    const { axios } = useAppContext();
    const [services, setServices] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [priceSingleSide, setPriceSingleSide] = useState('');
    const [priceDoubleSide, setPriceDoubleSide] = useState('');
    const [icon, setIcon] = useState('📄');
    const [category, setCategory] = useState('Printing');
    const [status, setStatus] = useState('Active');

    const fetchServices = async () => {
        try {
            const { data } = await axios.get('/api/services');
            if (data.success) setServices(data.services);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = editId ? '/api/services/update' : '/api/services/add';
            const payload = {
                id: editId || undefined,
                name,
                description,
                price: Number(price),
                priceSingleSide: Number(priceSingleSide),
                priceDoubleSide: Number(priceDoubleSide),
                icon,
                category,
                status
            };

            const { data } = await axios.post(endpoint, payload);
            if (data.success) {
                toast.success(editId ? "Service Updated" : "Service Added");
                setShowAdd(false);
                setEditId(null);
                fetchServices();
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
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            const { data } = await axios.post('/api/services/delete', { id });
            if (data.success) {
                toast.success("Service Deleted");
                fetchServices();
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (s) => {
        setEditId(s._id);
        setName(s.name);
        setDescription(s.description);
        setPrice(s.price || '');
        setPriceSingleSide(s.priceSingleSide || '');
        setPriceDoubleSide(s.priceDoubleSide || '');
        setIcon(s.icon);
        setCategory(s.category || 'Printing');
        setStatus(s.status || 'Active');
        setShowAdd(true);
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setPriceSingleSide('');
        setPriceDoubleSide('');
        setIcon('📄');
        setCategory('Printing');
        setStatus('Active');
        setEditId(null);
    };

    useEffect(() => { fetchServices(); }, []);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold font-outfit tracking-tight">Print Services</h2>
                    <p className="text-xs text-text-muted font-medium">Manage your printing service catalog and rates</p>
                </div>
                <button onClick={() => { if (showAdd) resetForm(); setShowAdd(!showAdd); }} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-95">
                    {showAdd ? 'Close Editor' : '+ Add New Service'}
                </button>
            </div>

            {showAdd && (
                <div className="card-premium p-8 max-w-2xl animate-in zoom-in-95 duration-300 border-2 border-slate-100">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field py-3 text-sm" placeholder="e.g. A3 Color Print" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price: Single Side (₹)</label>
                            <input value={priceSingleSide} onChange={(e) => setPriceSingleSide(e.target.value)} type="number" step="0.01" className="input-field py-3 text-sm font-mono" placeholder="e.g. 0.75" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price: Double Side (₹)</label>
                            <input value={priceDoubleSide} onChange={(e) => setPriceDoubleSide(e.target.value)} type="number" step="0.01" className="input-field py-3 text-sm font-mono" placeholder="e.g. 0.50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price (Global ₹)</label>
                            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" className="input-field py-3 text-sm font-mono" placeholder="e.g. 1.00" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Icon</label>
                            <select value={icon} onChange={(e) => setIcon(e.target.value)} className="input-field py-3 text-sm">
                                <option value="📄">Document 📄</option>
                                <option value="🖨️">Printer 🖨️</option>
                                <option value="🖼️">Photo 🖼️</option>
                                <option value="📚">Binding 📚</option>
                                <option value="🪪">ID Card 🪪</option>
                                <option value="📋">Bulk 📋</option>
                                <option value="🏷️">Label 🏷️</option>
                                <option value="📦">Package 📦</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field py-3 text-sm">
                                <option value="Printing">Printing</option>
                                <option value="Binding">Binding</option>
                                <option value="Lamination">Lamination</option>
                                <option value="ID Card">ID Card</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Status</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field py-3 text-sm font-bold">
                                <option value="Active">Active ✅</option>
                                <option value="Inactive">Inactive ❌</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field h-24 pt-3 text-sm" placeholder="Describe the printing service details..." required />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-[0.98]">
                                {loading ? 'Processing...' : editId ? 'Update Service ⚡' : 'Publish Service 🚀'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Service Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-slate-400 font-bold">No services found in database. Try adding one above.</p>
                    </div>
                ) : (
                    services.map((s, i) => (
                        <div key={i} className="card-premium p-6 flex flex-col justify-between hover:border-slate-300 transition-all group bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-50">
                                        {s.icon}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {s.status || 'Active'}
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            <button onClick={() => handleEdit(s)} className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all shadow-sm">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all shadow-sm">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black font-outfit text-slate-900">{s.name}</h3>
                                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{s.category}</p>
                                    <div className="flex gap-2 mt-2">
                                        {s.priceSingleSide > 0 && (
                                            <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase">Single</p>
                                                <p className="text-xs font-black text-slate-900">₹{s.priceSingleSide}</p>
                                            </div>
                                        )}
                                        {s.priceDoubleSide > 0 && (
                                            <div className="bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                <p className="text-[8px] font-bold text-slate-400 uppercase">Double</p>
                                                <p className="text-xs font-black text-slate-900">₹{s.priceDoubleSide}</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed mt-2">{s.description}</p>
                                </div>
                            </div>
                            <div className="pt-5 flex justify-between items-center border-t border-slate-100 mt-6 bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                                <p className="text-slate-400 text-[10px] font-bold">Base Price</p>
                                <span className="text-2xl font-black font-outfit text-slate-900">₹{s.price || 0}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageServices;
