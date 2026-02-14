import express from 'express';
import {
    getAllOrders,
    getUserOrders,
    placePrintOrder,
    updateOrderStatus,
    createPosOrder,
    cleanupOldFiles,
    updateOrderAndRecalculate,
    generatePaymentLink,
    generateThermalBillPDF,
    stripeWebhooks
} from '../controllers/orderController.js';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js';
import { upload } from '../configs/multer.js';

const orderRouter = express.Router();

orderRouter.post('/print', upload.array('files'), authUser, placePrintOrder);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.post('/pos', authSeller, createPosOrder);
orderRouter.get('/all', authSeller, getAllOrders);
orderRouter.post('/update-status', authSeller, updateOrderStatus);
orderRouter.post('/edit/:orderId', authSeller, updateOrderAndRecalculate);
orderRouter.post('/payment-link/:orderId', authSeller, generatePaymentLink);
orderRouter.get('/thermal-bill/:orderId', generateThermalBillPDF);
orderRouter.delete('/cleanup', authSeller, cleanupOldFiles);

export default orderRouter;