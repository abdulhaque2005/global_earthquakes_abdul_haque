import express from 'express';
import {
  getAnalyticsSummary,
  getMagnitudeAnalytics,
  getCountryAnalytics,
  getRiskZoneAnalytics,
  getYearlyTrends,
  getRegionalRiskPrediction,
  analyzeHighestMagnitude,
  analyzeDeepest,
  analyzeRecentActivity,
  analyzeLocations,
  analyzeCountries,
  analyzeNetworks,
  analyzeMagnitudes,
  analyzeDepths,
  analyzeErrors,
  analyzeMonthly,
} from '../controllers/analytics.controller.js';
import apiCache from '../middlewares/cache.middleware.js';
const router = express.Router();
router.get('/summary', apiCache(600), getAnalyticsSummary);
router.get('/magnitude', apiCache(600), getMagnitudeAnalytics);
router.get('/countries', apiCache(600), getCountryAnalytics);
router.get('/risk-zones', apiCache(600), getRiskZoneAnalytics);
router.get('/yearly-trends', apiCache(600), getYearlyTrends);
router.get('/predict', apiCache(600), getRegionalRiskPrediction);
router.get('/earthquakes/highest-magnitude', analyzeHighestMagnitude);
router.get('/earthquakes/deepest', analyzeDeepest);
router.get('/earthquakes/recent-activity', analyzeRecentActivity);
router.get('/earthquakes/location-analysis', analyzeLocations);
router.get('/earthquakes/country-analysis', analyzeCountries);
router.get('/earthquakes/network-analysis', analyzeNetworks);
router.get('/earthquakes/magnitude-analysis', analyzeMagnitudes);
router.get('/earthquakes/depth-analysis', analyzeDepths);
router.get('/earthquakes/error-analysis', analyzeErrors);
router.get('/earthquakes/monthly-analysis', analyzeMonthly);
export default router;
