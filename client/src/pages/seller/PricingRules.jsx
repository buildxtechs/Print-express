import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const PricingRules = () => {
    const { axios } = useAppContext();
    const [rules, setRules] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchRules = async () => {
        try {
            const { data } = await axios.get('/api/pricing');
            if (data.success) {
                const fetchedRules = data.pricing.rules;
                // Ensure nesting exists even if DB is old or empty
                const normalizedRules = {
                    printing: {
                        bw: fetchedRules.printing?.bw || { single: 2, double: 3 },
                        color: fetchedRules.printing?.color || { single: 10, double: 15 }
                    },
                    additional: {
                        binding: fetchedRules.additional?.binding || 50,
                        hard_binding: fetchedRules.additional?.hard_binding || 200,
                        chart_binding: fetchedRules.additional?.chart_binding || 150,
                        handling_fee: fetchedRules.additional?.handling_fee || 10
                    },
                    delivery: fetchedRules.delivery || 40,
                    delivery_tiers: fetchedRules.delivery_tiers || {
                        tier_a: 40,
                        tier_b: 60,
                        tier_c: 80,
                        tier_d: 150
                    }
                };
                setRules(normalizedRules);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/pricing/update', rules);
            if (data.success) toast.success("Pricing Updated Successfully");
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    useEffect(() => { fetchRules(); }, []);

    if (!rules) return <div className="p-8 text-center text-text-muted font-medium">Loading rules...</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-outfit">Printing Price Rules</h2>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Rates in ₹</span>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* B/W Printing */}
                <div className="card-premium p-8 space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                        <span className="bg-slate-100 p-2 rounded-lg">📄</span> B/W Printing (A4)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-muted">Single Side</label>
                            <input
                                value={rules.printing.bw.single}
                                onChange={(e) => setRules({ ...rules, printing: { ...rules.printing, bw: { ...rules.printing.bw, single: Number(e.target.value) } } })}
                                type="number" className="input-field w-24 text-center py-2"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-muted">Double Side</label>
                            <input
                                value={rules.printing.bw.double}
                                onChange={(e) => setRules({ ...rules, printing: { ...rules.printing, bw: { ...rules.printing.bw, double: Number(e.target.value) } } })}
                                type="number" className="input-field w-24 text-center py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Color Printing */}
                <div className="card-premium p-8 space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                        <span className="bg-blue-100 p-2 rounded-lg">🌈</span> Color Printing (A4)
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-muted">Single Side</label>
                            <input
                                value={rules.printing.color.single}
                                onChange={(e) => setRules({ ...rules, printing: { ...rules.printing, color: { ...rules.printing.color, single: Number(e.target.value) } } })}
                                type="number" className="input-field w-24 text-center py-2"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-text-muted">Double Side</label>
                            <input
                                value={rules.printing.color.double}
                                onChange={(e) => setRules({ ...rules, printing: { ...rules.printing, color: { ...rules.printing.color, double: Number(e.target.value) } } })}
                                type="number" className="input-field w-24 text-center py-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Charges */}
                <div className="card-premium p-8 space-y-6 md:col-span-2">
                    <h3 className="font-bold">Other Services & Fees</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Spiral Binding</label>
                            <input
                                value={rules.additional.binding}
                                onChange={(e) => setRules({ ...rules, additional: { ...rules.additional, binding: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Hard Binding</label>
                            <input
                                value={rules.additional.hard_binding}
                                onChange={(e) => setRules({ ...rules, additional: { ...rules.additional, hard_binding: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Chart Binding</label>
                            <input
                                value={rules.additional.chart_binding}
                                onChange={(e) => setRules({ ...rules, additional: { ...rules.additional, chart_binding: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Handling Fee</label>
                            <input
                                value={rules.additional.handling_fee}
                                onChange={(e) => setRules({ ...rules, additional: { ...rules.additional, handling_fee: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Tiers */}
                <div className="card-premium p-8 space-y-6 md:col-span-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <span className="bg-orange-100 p-2 rounded-lg">🚚</span> Volume-Based Delivery Charges
                        </h3>
                        <p className="text-[10px] bg-secondary/10 text-secondary px-3 py-1 rounded-full font-bold">Dynamic Tiers</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase block">Tier A (&lt;100 Pages)</label>
                            <input
                                value={rules.delivery_tiers.tier_a}
                                onChange={(e) => setRules({ ...rules, delivery_tiers: { ...rules.delivery_tiers, tier_a: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase block">Tier B (&gt;200 Pages)</label>
                            <input
                                value={rules.delivery_tiers.tier_b}
                                onChange={(e) => setRules({ ...rules, delivery_tiers: { ...rules.delivery_tiers, tier_b: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase block">Tier C (&gt;500 Pages)</label>
                            <input
                                value={rules.delivery_tiers.tier_c}
                                onChange={(e) => setRules({ ...rules, delivery_tiers: { ...rules.delivery_tiers, tier_c: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-muted uppercase block">Tier D (Bulk 1000+)</label>
                            <input
                                value={rules.delivery_tiers.tier_d}
                                onChange={(e) => setRules({ ...rules, delivery_tiers: { ...rules.delivery_tiers, tier_d: Number(e.target.value) } })}
                                type="number" className="input-field"
                            />
                        </div>
                    </div>
                    <p className="text-[10px] text-text-muted italic">Note: These tiers are applied automatically in the Delivery Estimator and Checkout based on total page count.</p>
                </div>

                <div className="md:col-span-2">
                    <button disabled={loading} className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary/20">
                        {loading ? 'Updating...' : 'Save All Changes 💾'}
                    </button>
                    <p className="text-center text-xs text-text-muted mt-4 font-medium">Any changes made here will immediately affect new user orders.</p>
                </div>
            </form>
        </div>
    );
};

export default PricingRules;
