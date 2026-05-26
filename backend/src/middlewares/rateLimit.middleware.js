import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  message: {
    success: false,
    error: 'Too many requests received from this IP, please try again after 15 minutes.',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP, please try again after an hour.',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
