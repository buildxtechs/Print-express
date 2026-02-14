import express from 'express';
import { getServices, addService, updateService, deleteService } from '../controllers/serviceController.js';
import authSeller, { authAdmin } from '../middlewares/authSeller.js';

const serviceRouter = express.Router();

serviceRouter.get('/', getServices);
serviceRouter.post('/add', authSeller, authAdmin, addService);
serviceRouter.post('/update', authSeller, authAdmin, updateService);
serviceRouter.post('/delete', authSeller, authAdmin, deleteService);

export default serviceRouter;
