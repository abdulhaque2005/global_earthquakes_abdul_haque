import express from 'express';
import { searchRoot, searchEarthquakes } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', searchRoot);
router.get('/earthquakes', searchEarthquakes);

export default router;
