import Service from "../models/Service.js";

// Get All Services : /api/services
export const getServices = async (req, res) => {
    try {
        const services = await Service.find({});
        res.json({ success: true, services });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Add Service (Admin) : /api/services/add
export const addService = async (req, res) => {
    try {
        const { name, icon, description, price, priceSingleSide, priceDoubleSide, priceRange, category, status, whatsappEnquiryLink } = req.body;
        const service = await Service.create({ name, icon, description, price, priceSingleSide, priceDoubleSide, priceRange, category, status, whatsappEnquiryLink });
        res.json({ success: true, service });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update Service (Admin) : /api/services/update
export const updateService = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;

        console.log("--- Update Service Attempt ---");
        console.log("ID:", id);
        console.log("Incoming Data:", JSON.stringify(updateData, null, 2));

        if (!id) {
            return res.json({ success: false, message: "Service ID is required" });
        }

        // Explicitly cast price if present
        if (updateData.price !== undefined) {
            const originalPrice = updateData.price;
            updateData.price = Number(updateData.price);
            console.log(`Casting Price: ${originalPrice} -> ${updateData.price} (Type: ${typeof updateData.price})`);

            if (isNaN(updateData.price)) {
                return res.json({ success: false, message: "Invalid price format" });
            }
        }

        const service = await Service.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!service) {
            console.log("Update Failed: Service not found in database");
            return res.json({ success: false, message: "Service not found" });
        }

        console.log("Update Success! New Price in DB:", service.price);
        res.json({ success: true, service });
    } catch (error) {
        console.log("Update Fatal Error:", error.message);
        res.json({ success: false, message: error.message });
    }
}

// Delete Service (Admin) : /api/services/delete
export const deleteService = async (req, res) => {
    try {
        const { id } = req.body;
        await Service.findByIdAndDelete(id);
        res.json({ success: true, message: "Service Deleted" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
