import prisma from '../prisma/prisma';

export const TxnService = {
    async submitTransaction(
        userId: string,
        data: { recipientAddress: string; amountSol: number },
    ) {
        // Record transaction intent in DB (will be signed client-side)
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                recipientAddress: data.recipientAddress,
                amountSol: data.amountSol,
                status: 'PENDING_SIGNATURE',
                createdAt: new Date(),
            },
        });

        return {
            transactionId: transaction.id,
            status: transaction.status,
            message: 'Transaction recorded. Sign on mobile app to execute.',
        };
    },

    async listUserTransactions(userId: string, limit = 20) {
        return prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },

    async getTransaction(userId: string, transactionId: string) {
        return prisma.transaction.findUnique({
            where: { id: transactionId, userId },
        });
    }
};