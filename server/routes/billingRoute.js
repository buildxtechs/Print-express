import express from 'express';
import { updateTracking, logMessaging, getMessageLogs } from '../controllers/billingController.js';
import authSeller from '../middlewares/authSeller.js';

const billingRouter = express.Router();

billingRouter.post('/update-tracking', authSeller, updateTracking);
billingRouter.post('/log-message', authSeller, logMessaging);
billingRouter.get('/message-logs', authSeller, getMessageLogs);

export default billingRouter;
