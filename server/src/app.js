import express from 'express';
import cors from 'cors';

import applicationRoutes from './routes/application.routes.js';
import companyRoutes from './routes/company.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/applications', applicationRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/interviews', interviewRoutes);
  app.use('/api/stats', statsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
