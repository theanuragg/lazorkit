import { NextFunction, Request, Response } from 'express';
import { WalletService } from './wallet.service';

export const WalletController = {
    async getBalance(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.sub;
            const result = await WalletService.getBalance(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async getWalletInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.sub;
            const result = await WalletService.getWalletInfo(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
};