import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { WalletController } from './wallet.controller';

const router = Router();

router.use(authenticateToken);

router.get('/balance', WalletController.getBalance);
router.get('/info', WalletController.getWalletInfo);

export default router;
