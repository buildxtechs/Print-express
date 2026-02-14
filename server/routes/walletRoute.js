import express from 'express';
import {
    getBalance,
    getTransactions,
    addCoins,
    deductCoins,
    getAllWallets,
    createRechargeSession
} from '../controllers/walletController.js';
import authUser from '../middlewares/authUser.js';

const walletRouter = express.Router();

walletRouter.get('/balance', authUser, getBalance);
walletRouter.get('/transactions', authUser, getTransactions);
walletRouter.post('/add', addCoins);
walletRouter.post('/deduct', deductCoins);
walletRouter.get('/all', getAllWallets);
walletRouter.post('/recharge', authUser, createRechargeSession);

export default walletRouter;
