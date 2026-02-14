import mongoose from 'mongoose';
import 'dotenv/config';
import Pricing from './models/Pricing.js';
import User from './models/User.js';
import connectDB from './configs/db.js';

const seedDB = async () => {
    try {
        await connectDB();

        // 1. Initial Pricing Rules
        const existingPricing = await Pricing.findOne({ type: 'printing_rules' });
        if (!existingPricing) {
            await Pricing.create({
                type: 'printing_rules',
                rules: {
                    printing: {
                        bw: { single: 2, double: 3 },
                        color: { single: 10, double: 15 }
                    },
                    additional: {
                        binding: 50,
                        hard_binding: 200,
                        handling_fee: 10
                    }
                }
            });
            console.log('✅ Default pricing rules created');
        } else {
            console.log('ℹ️  Pricing rules already exist');
        }

        // 2. Sample Admin/User if needed
        const existingUser = await User.findOne({ phone: '9876543210' });
        if (!existingUser) {
            await User.create({
                name: 'Test Customer',
                email: 'test@example.com',
                phone: '9876543210',
                walletBalance: 100
            });
            console.log('✅ Test user created');
        }

        console.log('🚀 Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedDB();
