import express from 'express';
import {
  generateJwtToken,
  verifyJwtToken,
  refreshJwtToken,
  revokeJwtToken,
  getProfile,
} from '../controllers/auth.controller.js';
import {
  getEarthquakes,
} from '../controllers/earthquake.controller.js';
import {
  getMagnitudeAnalytics,
} from '../controllers/analytics.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/generate-token', generateJwtToken);
router.post('/verify-token', verifyJwtToken);
router.post('/refresh-token', refreshJwtToken);
router.delete('/revoke-token', revokeJwtToken);

router.get('/profile', protect, getProfile);
router.get('/private-earthquakes', protect, getEarthquakes);
router.get('/private-analytics', protect, getMagnitudeAnalytics);
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({ success: true, message: 'JWT Protected Dashboard accessed.' });
});

export default router;
