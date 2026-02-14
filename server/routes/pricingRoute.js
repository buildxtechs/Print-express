import express from 'express';
import { getPricing, updatePricing } from '../controllers/pricingController.js';
import authSeller, { authAdmin } from '../middlewares/authSeller.js';

const pricingRouter = express.Router();

pricingRouter.get('/', getPricing);
pricingRouter.post('/update', authSeller, authAdmin, updatePricing);

export default pricingRouter;
