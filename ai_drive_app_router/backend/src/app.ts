import cors from 'cors';
import express from 'express';
import articleRoutes from './routes/articleRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3002',
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/articles', articleRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
