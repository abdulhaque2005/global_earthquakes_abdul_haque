import express from 'express';
import { getAlerts, createAlert } from '../controllers/alert.controller.js';
import protect from '../middlewares/auth.middleware.js';
import adminOnly from '../middlewares/admin.middleware.js';
const router = express.Router();
router.get('/', getAlerts);
router.post('/create', protect, adminOnly, createAlert);
export default router;
