import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getEnv } from '../config/env';
import prisma from '../prisma/prisma';

const env = getEnv();

export class WalletService {
    private static connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');

    static async getBalance(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user?.solanaAddress) {
            return { balance: 0, cached: false };
        }

        try {
            const balance = await this.connection.getBalance(new PublicKey(user.solanaAddress));
            const balanceInSol = balance / LAMPORTS_PER_SOL;

            // Cache balance (optional)
            await prisma.user.update({
                where: { id: userId },
                data: {
                    cachedBalance: balanceInSol,
                    balanceUpdatedAt: new Date(),
                },
            });

            return { balance: balanceInSol, cached: false };
        } catch (error) {
            // Return cached balance on error
            return {
                balance: user.cachedBalance ?? 0,
                cached: true,
                error: 'Failed to fetch live balance',
            };
        }
    }

    static async getWalletInfo(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return {
            address: user?.solanaAddress,
            balance: user?.cachedBalance ?? 0,
            displayName: user?.displayName,
        };
    }
}
