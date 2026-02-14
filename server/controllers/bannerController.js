import Banner from "../models/Banner.js";

// Get All Banners : /api/banner
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        res.json({ success: true, banners });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Add Banner (Admin) : /api/banner/add
export const addBanner = async (req, res) => {
    try {
        const { image, title, link, isActive } = req.body;
        const banner = await Banner.create({ image, title, link, isActive });
        res.json({ success: true, banner });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update Banner (Admin) : /api/banner/update
export const updateBanner = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        if (!id) return res.json({ success: false, message: "Banner ID is required" });

        const banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
        if (!banner) return res.json({ success: false, message: "Banner not found" });

        res.json({ success: true, banner });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Delete Banner (Admin) : /api/banner/delete
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.body;
        await Banner.findByIdAndDelete(id);
        res.json({ success: true, message: "Banner Deleted" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
