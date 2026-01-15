import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { TxnService } from './txn.service';

const SendTransactionSchema = z.object({
    recipientAddress: z.string(),
    amountSol: z.number().positive(),
});

export const TxnController = {
    async sendTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.sub;
            const validated = SendTransactionSchema.parse(req.body);
            const result = await TxnService.submitTransaction(userId, validated);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async listTransactions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.sub;
            // potentially parse limit from query
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            const result = await TxnService.listUserTransactions(userId, limit);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async getTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.sub;
            const txId = req.params.id;
            const result = await TxnService.getTransaction(userId, txId);
            if (!result) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
};