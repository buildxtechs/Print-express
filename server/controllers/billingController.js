import Order from "../models/Order.js";
import MessagingLog from "../models/MessagingLog.js";
import User from "../models/User.js";

// Update Tracking Details : /api/billing/update-tracking
export const updateTracking = async (req, res) => {
    try {
        const { orderId, courierName, trackingNumber } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, {
            'trackingDetails.courierName': courierName,
            'trackingDetails.trackingNumber': trackingNumber,
            'trackingDetails.updatedAt': new Date()
        }, { new: true });

        if (!order) return res.json({ success: false, message: "Order not found" });

        res.json({ success: true, message: "Tracking details updated", order });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Log WhatsApp Message : /api/billing/log-message
export const logMessaging = async (req, res) => {
    try {
        const { orderId, userId, phoneNumber, content } = req.body;
        const sentBy = req.sellerRole || 'admin';

        const log = await MessagingLog.create({
            orderId,
            userId,
            sentBy,
            phoneNumber,
            content
        });

        res.json({ success: true, log });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Messaging Logs : /api/billing/message-logs
export const getMessageLogs = async (req, res) => {
    try {
        const logs = await MessagingLog.find({}).populate('userId', 'name phone').sort({ createdAt: -1 });
        res.json({ success: true, logs });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
