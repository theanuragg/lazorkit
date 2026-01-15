import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    REDIS_URL: z.string().default('redis://localhost:6379'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    SOLANA_RPC_URL: z.string().default('https://api.devnet.solana.com'),
    LAZORKIT_PAYMASTER_URL: z.string().optional(),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Environment = z.infer<typeof envSchema>;

export const validate = (config: Record<string, unknown>) => {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        console.error('Invalid environment variables:', result.error.format());
        process.exit(1);
    }
    return result.data;
};

export const getEnv = (): Environment => {
    return validate(process.env as Record<string, unknown>);
};