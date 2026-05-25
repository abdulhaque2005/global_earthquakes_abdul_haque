import express from 'express';
import { getReports, createReport, deleteReport } from '../controllers/report.controller.js';
import protect from '../middlewares/auth.middleware.js';
import adminOnly from '../middlewares/admin.middleware.js';

const router = express.Router();

router
  .route('/')
  .get(getReports)
  .post(protect, createReport);

router
  .route('/:id')
  .delete(protect, adminOnly, deleteReport);

export default router;
