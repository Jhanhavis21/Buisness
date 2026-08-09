import express from 'express';
import cors from 'cors';

import { config } from './config/environment.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { validateEnv } from './middleware/validate-env.js';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();

const normalizeOrigin = (origin: string) =>
  origin.trim().replace(/\/$/, '');

const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]
  .filter(Boolean)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      logger.error('CORS origin rejected', {
        origin: normalizedOrigin,
        allowedOrigins,
      });

      callback(new Error('Origin not allowed by CORS'));
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use(requestLogger);

app.use(validateEnv);

app.use('/api', routes);

app.use(errorHandler);

const port = config.port;

if (process.env.VERCEL !== '1') {
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info('Backend server started', {
      port,
      environment: config.environment,
    });
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error('Port already in use', { port });
      process.exit(1);
    }

    logger.error('Server startup error', {
      message: error.message,
    });

    process.exit(1);
  });
}

export default app;