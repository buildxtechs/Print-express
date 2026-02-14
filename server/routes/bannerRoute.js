import express from 'express';
import { getBanners, addBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';

const bannerRouter = express.Router();

bannerRouter.get('/', getBanners);
bannerRouter.post('/add', addBanner);
bannerRouter.post('/update', updateBanner);
bannerRouter.post('/delete', deleteBanner);

export default bannerRouter;
