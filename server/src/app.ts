import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { getEnv } from './config/env';

// Route imports
import authRoutes from './auth/auth.routes';
import txnRoutes from './txn/txn.routes';
import walletRoutes from './wallet/wallet.routes';

const app = express();
const env = getEnv();

// Middleware
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN || ['http://localhost:19000', 'http://localhost:8081', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/txn', txnRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: req.url,
    });
});

export default app;
