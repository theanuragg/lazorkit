import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';

const WebAuthnChallengeRequestSchema = z.object({
    username: z.string().email('Invalid email'),
    displayName: z.string().optional(),
});

const WebAuthnVerifySchema = z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
        clientDataJSON: z.string(),
        attestationObject: z.string(),
    }),
    type: z.literal('public-key'),
});

const RefreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export const AuthController = {
    async getChallenge(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = WebAuthnChallengeRequestSchema.parse(req.body);
            const result = await AuthService.generateChallenge(validated.username, validated.displayName);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = WebAuthnVerifySchema.parse(req.body);
            const result = await AuthService.verifyWebAuthn(validated);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const validated = RefreshTokenSchema.parse(req.body);
            const result = await AuthService.refreshToken(validated.refreshToken);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            res.status(200).json({ userId: user.sub, email: user.email });
        } catch (error) {
            next(error);
        }
    }
};