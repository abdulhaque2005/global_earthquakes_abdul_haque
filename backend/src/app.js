import express from 'express';
import Earthquake from './models/Earthquake.js';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import requestLogger from './middlewares/logger.middleware.js';
import { globalLimiter } from './middlewares/rateLimit.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import earthquakeRoutes from './routes/earthquake.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import alertRoutes from './routes/alert.routes.js';
import adminRoutes from './routes/admin.routes.js';
import searchRoutes from './routes/search.routes.js';
import statsRoutes from './routes/stats.routes.js';
import jwtRoutes from './routes/jwt.routes.js';
import practiceRoutes from './routes/practice.routes.js';
import reportRoutes from './routes/report.routes.js';
const app = express();
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(mongoSanitize());
app.use(hpp());
app.use(compression());
app.use(requestLogger);
app.use('/api', globalLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/earthquakes', earthquakeRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/jwt', jwtRoutes);
app.use('/api/v1/middleware', practiceRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/protected/earthquakes', earthquakeRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'QuakeVision API is running.' });
});
app.get('/api/v1/earthquakes/system/health', (req, res) => {
  res.status(200).json({ success: true, status: 'Operational', version: '1.0.0' });
});
app.head('/api/v1/earthquakes', async (req, res) => {
  try {
    const count = await Earthquake.countDocuments();
    res.setHeader('X-Total-Count', String(count));
    res.status(200).end();
  } catch {
    res.setHeader('X-Total-Count', '0');
    res.status(200).end();
  }
});
app.options('/api/v1/earthquakes', (req, res) => {
  res.setHeader('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).end();
});
app.options('/api/v1/auth/login', (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  res.status(200).end();
});
app.options('/api/v1/admin/earthquakes', (req, res) => {
  res.setHeader('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).end();
});
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler);
export default app;
