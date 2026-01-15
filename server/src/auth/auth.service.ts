import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env';
import prisma from '../prisma/prisma';

const env = getEnv();

export const AuthService = {
    async generateChallenge(email: string, displayName?: string) {
        // Generate random 32-byte challenge
        const challenge = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64');

        // Store challenge in DB with expiry (5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    displayName: displayName || email.split('@')[0],
                    passkeyChallenge: challenge,
                    passkeyChallengeExpiresAt: expiresAt,
                },
            });
        } else {
            await prisma.user.update({
                where: { email },
                data: {
                    passkeyChallenge: challenge,
                    passkeyChallengeExpiresAt: expiresAt,
                },
            });
        }

        return {
            challenge,
            userId: user.id,
            rp: { name: 'Lazorkit Tipper', id: new URL(env.CORS_ORIGIN || 'http://localhost:3000').hostname },
            user: {
                id: user.id,
                name: email,
                displayName: user.displayName,
            },
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
            attestation: 'direct',
            timeout: 60000,
        };
    },

    async verifyWebAuthn(attestationResponse: { id: string; rawId: string; response: any; type: string }) {
        // In production, use webauthn library to verify
        // This is a simplified placeholder
        const user = await prisma.user.findUnique({
            where: { id: attestationResponse.id },
        });

        if (!user) {
            throw { status: 401, message: 'User not found' };
        }

        // Verify attestation response (use fido2-lib or similar)
        // For MVP, trust client-side validation
        const now = new Date();
        if (!user.passkeyChallengeExpiresAt || user.passkeyChallengeExpiresAt < now) {
            throw { status: 401, message: 'Challenge expired' };
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { sub: user.id, email: user.email },
            env.JWT_SECRET as jwt.Secret,
            { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        const refreshToken = jwt.sign(
            { sub: user.id },
            env.JWT_REFRESH_SECRET as jwt.Secret,
            { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
        );

        // Store refresh token hash
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: now,
                passkeyChallenge: null,
                passkeyChallengeExpiresAt: null,
            },
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes in seconds
            tokenType: 'Bearer',
        };
    },

    async refreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET as jwt.Secret) as any;

            const user = await prisma.user.findUnique({
                where: { id: payload.sub },
            });

            if (!user) {
                throw { status: 401, message: 'User not found' };
            }

            const newAccessToken = jwt.sign(
                { sub: user.id, email: user.email },
                env.JWT_SECRET as jwt.Secret,
                { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
            );

            return {
                accessToken: newAccessToken,
                expiresIn: 900,
                tokenType: 'Bearer',
            };
        } catch (error) {
            throw { status: 401, message: 'Invalid refresh token' };
        }
    }
};