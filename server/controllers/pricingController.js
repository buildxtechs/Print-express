import Pricing from "../models/Pricing.js";

// Get Pricing Rules : /api/pricing
export const getPricing = async (req, res) => {
    try {
        let pricing = await Pricing.findOne({ type: 'printing_rules' });
        if (!pricing) {
            pricing = await Pricing.create({
                type: 'printing_rules',
                rules: {
                    printing: {
                        bw: { single: 2, double: 3 },
                        color: { single: 10, double: 15 }
                    },
                    additional: {
                        binding: 50,
                        hard_binding: 200,
                        chart_binding: 150,
                        handling_fee: 10
                    },
                    delivery_tiers: {
                        tier_a: 40,
                        tier_b: 60,
                        tier_c: 80,
                        tier_d: 150
                    }
                }
            });
        }
        res.json({ success: true, pricing });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update Pricing Rules (Admin) : /api/pricing/update
export const updatePricing = async (req, res) => {
    try {
        const { printing, additional, delivery_tiers } = req.body;
        const pricing = await Pricing.findOneAndUpdate(
            { type: 'printing_rules' },
            { rules: { printing, additional, delivery_tiers } },
            { new: true, upsert: true }
        );
        res.json({ success: true, pricing });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
