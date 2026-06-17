import express from 'express';
import {
  getEarthquakes,
  getEarthquakeById,
  createEarthquake,
  replaceEarthquake,
  updateEarthquake,
  deleteEarthquake,
  checkEarthquakeExists,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  getByPlace,
  getByCountry,
  getByType,
  getByStatus,
  getByMagType,
  getByNetwork,
  getHighMagnitude,
  getLowMagnitude,
  getDeep,
  getShallow,
  getRecent,
  getReviewed,
  getHighGap,
  getHighRms,
  getOceanic,
  getCritical,
  getByMagnitude,
  getByDepth,
  getByDate,
  getByYear,
  getByMonth,
  sortByMagnitudeDesc,
  sortByTimeDesc,
  getRandomEarthquake,
  importJson,
} from '../controllers/earthquake.controller.js';
import protect from '../middlewares/auth.middleware.js';
import adminOnly from '../middlewares/admin.middleware.js';
import validate from '../middlewares/validation.middleware.js';
import {
  createEarthquakeValidation,
  updateEarthquakeValidation,
} from '../validations/earthquake.validation.js';
const router = express.Router();
router
  .route('/')
  .get(getEarthquakes)
  .post(protect, createEarthquakeValidation, validate, createEarthquake);
router.post('/bulk-create', protect, bulkCreate);
router.patch('/bulk-update', protect, bulkUpdate);
router.delete('/bulk-delete', protect, bulkDelete);
router.post('/import-json', protect, importJson);
router.get('/random', getRandomEarthquake);
router.get('/exists/:id', checkEarthquakeExists);
router.get('/sort/magnitude-desc', sortByMagnitudeDesc);
router.get('/sort/time-desc', sortByTimeDesc);
router.get('/high-magnitude', getHighMagnitude);
router.get('/deep', getDeep);
router.get('/shallow', getShallow);
router.get('/recent', getRecent);
router.get('/reviewed', getReviewed);
router.get('/high-gap', getHighGap);
router.get('/high-rms', getHighRms);
router.get('/oceanic', getOceanic);
router.get('/critical', getCritical);
router.get('/place/:place', getByPlace);
router.get('/country/:country', getByCountry);
router.get('/type/:type', getByType);
router.get('/status/:status', getByStatus);
router.get('/mag-type/:magType', getByMagType);
router.get('/network/:net', getByNetwork);
router.get('/magnitude/:mag', getByMagnitude);
router.get('/depth/:depth', getByDepth);
router.get('/date/:date', getByDate);
router.get('/year/:year', getByYear);
router.get('/month/:month', getByMonth);
router.get('/filter/high-magnitude', getHighMagnitude);
router.get('/filter/low-magnitude', getLowMagnitude);
router.get('/filter/deep', getDeep);
router.get('/filter/shallow', getShallow);
router.get('/filter/high-gap', getHighGap);
router.get('/filter/high-rms', getHighRms);
router.get('/filter/reviewed', getReviewed);
router.get('/filter/oceanic', getOceanic);
router.get('/filter/recent', getRecent);
router.get('/filter/critical', getCritical);
router
  .route('/:id')
  .get(getEarthquakeById)
  .put(protect, createEarthquakeValidation, validate, replaceEarthquake)
  .patch(protect, updateEarthquakeValidation, validate, updateEarthquake)
  .delete(protect, adminOnly, deleteEarthquake);
export default router;
