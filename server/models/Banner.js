import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Banner = mongoose.models.banner || mongoose.model('banner', bannerSchema);

export default Banner;
