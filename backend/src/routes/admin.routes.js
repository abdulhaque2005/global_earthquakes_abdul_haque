import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemStats,
} from '../controllers/admin.controller.js';
import {
  getEarthquakes,
} from '../controllers/earthquake.controller.js';
import {
  getMagnitudeAnalytics,
} from '../controllers/analytics.controller.js';
import { getReports } from '../controllers/report.controller.js';
import protect from '../middlewares/auth.middleware.js';
import adminOnly from '../middlewares/admin.middleware.js';
const router = express.Router();
router.use(protect);
router.use(adminOnly);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/stats', getSystemStats);
router.get('/dashboard', getSystemStats);
router.get('/earthquakes', getEarthquakes);
router.get('/analytics', getMagnitudeAnalytics);
router.get('/reports', getReports);
export default router;
