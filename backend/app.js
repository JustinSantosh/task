import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { APP_NAME, CLIENT_URL, NODE_ENV, PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import taskRouter from './routes/task.routes.js';

const app = express();
const appName = APP_NAME || 'TaskFlow API';
const allowedOrigins = new Set([
  ...CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/v1/tasks', taskRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    service: appName,
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: `${appName} is online`,
    docs: '/health',
  });
});

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`${appName} is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
