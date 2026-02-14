
import mongoose from 'mongoose';
import 'dotenv/config';
import Pricing from './models/Pricing.js';

async function checkPricing() {
    await mongoose.connect(process.env.MONGODB_URI);
    const pricing = await Pricing.findOne({ type: 'printing_rules' });
    console.log(JSON.stringify(pricing, null, 2));
    process.exit(0);
}

checkPricing();
