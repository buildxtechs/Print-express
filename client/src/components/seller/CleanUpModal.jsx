import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const CleanUpModal = ({ isOpen, onClose }) => {
    const { axios } = useAppContext();
    const [step, setStep] = useState(1);
    const [isBackedUp, setIsBackedUp] = useState(false);
    const [isAwareOfPermanence, setIsAwareOfPermanence] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleExport = async () => {
        try {
            const { data } = await axios.get('/api/system/export');
            if (data.success) {
                const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `print_express_backup_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Backup Downloaded Successfully");
                setStep(2);
            }
        } catch (error) {
            toast.error("Export failed: " + error.message);
        }
    };

    const handleClearData = async () => {
        if (confirmText !== 'I UNDERSTAND') {
            return toast.error("Please type 'I UNDERSTAND' correctly");
        }
        setLoading(true);
        try {
            const { data } = await axios.post('/api/system/clear', { confirm: confirmText });
            if (data.success) {
                toast.success("Data Cleared Successfully");
                onClose();
                window.location.reload(); // Hard reload to clear all states
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-slate-900 px-8 py-6 flex justify-between items-center text-white">
                    <div>
                        <h3 className="text-xl font-black font-outfit uppercase tracking-tighter">System Clean Up</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operation: Database Purge</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-xl">✕</button>
                </div>

                <div className="p-8 space-y-6">
                    {step === 1 && (
                        <div className="space-y-6 text-center">
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">
                                💾
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-slate-900">Step 1: Backup Data</h4>
                                <p className="text-sm text-slate-500 font-medium">Download a complete snapshot of your business data (Orders, Customers, Products, etc.) before proceeding.</p>
                            </div>
                            <button onClick={handleExport} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">
                                DOWNLOAD SYSTEM BACKUP (.JSON)
                            </button>
                            <p className="text-[10px] text-slate-400 font-bold uppercase cursor-pointer hover:text-slate-600" onClick={() => setStep(2)}>ALREADY HAVE A BACKUP →</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-4 items-start">
                                <span className="text-2xl">⚠️</span>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-amber-900 uppercase tracking-widest leading-none">Warning</p>
                                    <p className="text-[11px] font-bold text-amber-800 leading-normal">This action will permanently delete all orders, wallets, transactions, and customer accounts. This cannot be undone.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                                    <input type="checkbox" checked={isBackedUp} onChange={(e) => setIsBackedUp(e.target.checked)} className="w-6 h-6 rounded-lg text-slate-900 focus:ring-slate-900 border-2" />
                                    <p className="text-sm font-bold text-slate-700">I have downloaded and verified the backup file.</p>
                                </label>
                                <label className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
                                    <input type="checkbox" checked={isAwareOfPermanence} onChange={(e) => setIsAwareOfPermanence(e.target.checked)} className="w-6 h-6 rounded-lg text-slate-900 focus:ring-slate-900 border-2" />
                                    <p className="text-sm font-bold text-slate-700">I understand that this data will be lost forever.</p>
                                </label>
                            </div>

                            <button
                                disabled={!isBackedUp || !isAwareOfPermanence}
                                onClick={() => setStep(3)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl disabled:opacity-20 disabled:grayscale"
                            >
                                CONTINUE TO FINAL STEP
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner animate-pulse">
                                💣
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-700 font-bold">Type <span className="text-red-600 font-black">I UNDERSTAND</span> in the box below to authorize the deletion.</p>
                                <input
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="Type here..."
                                    className="w-full text-center py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 placeholder:text-slate-300 focus:border-red-500 focus:outline-none focus:bg-white transition-all"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setStep(2)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                                    BACK
                                </button>
                                <button
                                    disabled={confirmText !== 'I UNDERSTAND' || loading}
                                    onClick={handleClearData}
                                    className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95 disabled:opacity-20"
                                >
                                    {loading ? 'PURGING...' : 'PROCEED & PURGE 🔓'}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Staff accounts (Admin/Billing) will NOT be affected.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CleanUpModal;
