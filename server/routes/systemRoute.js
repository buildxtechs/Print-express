import express from 'express';
import { exportSystemData, clearSystemData } from '../controllers/systemController.js';
import authSeller, { authAdmin } from '../middlewares/authSeller.js';

const systemRouter = express.Router();

// Both require Admin privileges for safety
systemRouter.get('/export', authSeller, authAdmin, exportSystemData);
systemRouter.post('/clear', authSeller, authAdmin, clearSystemData);

export default systemRouter;
