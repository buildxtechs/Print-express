import mongoose from "mongoose";

const messagingLogSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    sentBy: { type: String, enum: ['admin', 'billing_manager'], required: true },
    messageType: { type: String, default: 'follow-up' },
    phoneNumber: { type: String, required: true },
    content: { type: String },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
}, { timestamps: true });

const MessagingLog = mongoose.models.messagingLog || mongoose.model('messagingLog', messagingLogSchema);

export default MessagingLog;
