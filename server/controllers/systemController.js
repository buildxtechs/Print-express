import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Service from "../models/Service.js";
import Wallet from "../models/Wallet.js";
import Pricing from "../models/Pricing.js";
import Coupon from "../models/Coupon.js";
import SupportQuery from "../models/SupportQuery.js";

// Export All Data : GET /api/system/export
export const exportSystemData = async (req, res) => {
    try {
        const data = {
            orders: await Order.find({}),
            users: await User.find({ role: 'customer' }), // Only export customers
            products: await Product.find({}),
            services: await Service.find({}),
            wallets: await Wallet.find({}),
            pricingRules: await Pricing.find({}),
            coupons: await Coupon.find({}),
            supportQueries: await SupportQuery.find({}),
            exportDate: new Date().toISOString(),
            system: "Print Express"
        };

        res.json({ success: true, data });
    } catch (error) {
        console.log("Export Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Clear All Data : POST /api/system/clear
export const clearSystemData = async (req, res) => {
    try {
        const { confirm } = req.body;
        if (confirm !== 'I UNDERSTAND') {
            return res.json({ success: false, message: "Safety confirmation failed" });
        }

        // 1. Delete Orders
        await Order.deleteMany({});

        // 2. Delete non-staff Users
        await User.deleteMany({ role: { $nin: ['admin', 'billing_manager'] } });

        // 3. Delete Wallets (since they are linked to users)
        await Wallet.deleteMany({});

        // 4. Products
        await Product.deleteMany({});

        // 5. Pricing Rules
        await Pricing.deleteMany({});

        // 6. Coupons
        await Coupon.deleteMany({});

        // 7. Support Queries
        await SupportQuery.deleteMany({});

        res.json({ success: true, message: "System Data Cleared (Business only)" });
    } catch (error) {
        console.log("Cleanup Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}
