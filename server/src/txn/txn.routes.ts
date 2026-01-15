import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { TxnController } from './txn.controller';

const router = Router();

router.use(authenticateToken);

router.post('/', TxnController.sendTransaction);
router.get('/', TxnController.listTransactions);
router.get('/:id', TxnController.getTransaction);

export default router;
