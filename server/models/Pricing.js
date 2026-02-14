import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
    type: { type: String, unique: true, default: 'printing_rules' },
    rules: {
        printing: {
            bw: {
                single: { type: Number, default: 2 },
                double: { type: Number, default: 3 }
            },
            color: {
                single: { type: Number, default: 10 },
                double: { type: Number, default: 15 }
            }
        },
        additional: {
            binding: { type: Number, default: 50 },
            hard_binding: { type: Number, default: 200 },
            chart_binding: { type: Number, default: 150 },
            handling_fee: { type: Number, default: 10 }
        },
        delivery_tiers: {
            tier_a: { type: Number, default: 40 }, // < 100 pages
            tier_b: { type: Number, default: 60 }, // > 200 pages
            tier_c: { type: Number, default: 80 }, // > 500 pages
            tier_d: { type: Number, default: 150 } // Up to 1000 pages (bulk)
        }
    }
}, { timestamps: true });

const Pricing = mongoose.models.pricing || mongoose.model('pricing', pricingSchema);

export default Pricing;
