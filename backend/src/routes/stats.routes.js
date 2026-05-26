import express from 'express';
import {
  getStatsOverview,
  getCount,
  getHighestMagnitude,
  getDeepest,
  getAverageDepth,
  getAverageMagnitude,
  getCountryCount,
  getTypeCount,
  getNetworkCount,
  getReviewedCount,
  getMonthlyCount,
} from '../controllers/stats.controller.js';
import apiCache from '../middlewares/cache.middleware.js';

const router = express.Router();

router.get('/overview', apiCache(300), getStatsOverview);
router.get('/earthquakes/count', apiCache(300), getCount);
router.get('/earthquakes/highest-magnitude', apiCache(600), getHighestMagnitude);
router.get('/earthquakes/deepest', apiCache(600), getDeepest);
router.get('/earthquakes/average-depth', apiCache(600), getAverageDepth);
router.get('/earthquakes/average-magnitude', apiCache(600), getAverageMagnitude);
router.get('/earthquakes/country-count', getCountryCount);
router.get('/earthquakes/type-count', getTypeCount);
router.get('/earthquakes/network-count', getNetworkCount);
router.get('/earthquakes/reviewed-count', getReviewedCount);
router.get('/earthquakes/monthly-count', getMonthlyCount);

export default router;
