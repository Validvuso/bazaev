import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import minerRoutes from './routes/miner.js';
import reactorRoutes from './routes/reactor.js';
import userRoutes from './routes/user.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'nexus-miner-backend' }));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/miner', minerRoutes);
app.use('/api/reactor', reactorRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

app.listen(port, () => console.log(`Nexus Miner API запущен на :${port}`));
