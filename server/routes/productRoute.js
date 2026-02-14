import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller, { authAdmin } from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, authAdmin, addProduct);
productRouter.get('/list', productList)
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, authAdmin, changeStock)

export default productRouter;