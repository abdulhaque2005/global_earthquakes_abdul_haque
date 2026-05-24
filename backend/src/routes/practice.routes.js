import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import { globalLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.get('/logger', (req, res) => {
  res.status(200).json({ success: true, message: 'Logger middleware demonstrated.' });
});

router.get('/auth', protect, (req, res) => {
  res.status(200).json({ success: true, message: 'Auth middleware passed.', user: req.user });
});

router.get('/rate-limit', globalLimiter, (req, res) => {
  res.status(200).json({ success: true, message: 'Rate limit middleware applied.' });
});

router.get('/error-handler', (req, res, next) => {
  const error = new Error('Demonstration error for global error handler.');
  error.statusCode = 400;
  next(error);
});

router.get('/request-time', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Request timing demonstrated.',
    requestTime: new Date().toISOString()
  });
});

router.get('/cache', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).json({ success: true, message: 'API Caching headers applied.' });
});

export default router;
