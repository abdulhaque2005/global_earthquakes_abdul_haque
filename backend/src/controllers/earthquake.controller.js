import Earthquake from '../models/Earthquake.js';
import ApiFeatures from '../utils/apiFeatures.js';
import getPaginationMeta from '../utils/pagination.js';
import calculateRiskDetails from '../utils/riskCalculator.js';
import alertService from '../services/alert.service.js';
import mapService from '../services/map.service.js';

export const getEarthquakes = async (req, res, next) => {
  try {

    if (req.query.lat && req.query.lng) {
      const radius = parseFloat(req.query.radius) || 500;
      const limit = parseInt(req.query.limit, 10) || 100;
      const data = await mapService.getEarthquakesWithinRadius(
        parseFloat(req.query.lat), parseFloat(req.query.lng), radius, limit
      );
      return res.status(200).json({ success: true, count: data.length, queryType: 'Geospatial Radius', data });
    }

    if (req.query.swLng && req.query.swLat && req.query.neLng && req.query.neLat) {
      const limit = parseInt(req.query.limit, 10) || 200;
      const data = await mapService.getEarthquakesInBoundingBox(
        parseFloat(req.query.swLng), parseFloat(req.query.swLat),
        parseFloat(req.query.neLng), parseFloat(req.query.neLat), limit
      );
      return res.status(200).json({ success: true, count: data.length, queryType: 'Geospatial Bounding Box', data });
    }

    const extraFilter = {};

    if (req.query.country) extraFilter.place = new RegExp(req.query.country, 'i');
    if (req.query.place) extraFilter.place = new RegExp(req.query.place, 'i');
    if (req.query.status) extraFilter.status = req.query.status;
    if (req.query.magType) extraFilter.magType = req.query.magType;
    if (req.query.network) extraFilter.net = req.query.network;
    if (req.query.type) extraFilter.type = req.query.type;

    if (req.query.minMagnitude || req.query.maxMagnitude) {
      extraFilter.magnitude = {};
      if (req.query.minMagnitude) extraFilter.magnitude.$gte = parseFloat(req.query.minMagnitude);
      if (req.query.maxMagnitude) extraFilter.magnitude.$lte = parseFloat(req.query.maxMagnitude);
    }
    if (req.query.minDepth || req.query.maxDepth) {
      extraFilter.depth = {};
      if (req.query.minDepth) extraFilter.depth.$gte = parseFloat(req.query.minDepth);
      if (req.query.maxDepth) extraFilter.depth.$lte = parseFloat(req.query.maxDepth);
    }
    if (req.query.minGap) extraFilter.gap = { $gte: parseFloat(req.query.minGap) };
    if (req.query.minRms) extraFilter.rms = { $gte: parseFloat(req.query.minRms) };
    if (req.query.year) {
      const y = parseInt(req.query.year, 10);
      extraFilter.time = { $gte: new Date(`${y}-01-01`), $lt: new Date(`${y + 1}-01-01`) };
    }
    if (req.query.month) {
      const m = parseInt(req.query.month, 10);
      extraFilter.$expr = { $eq: [{ $month: '$time' }, m] };
    }

    const baseQuery = Earthquake.find(extraFilter);
    const features = new ApiFeatures(baseQuery, req.query).search().filter().sort().limitFields();

    const countBase = Earthquake.find(extraFilter);
    const countFeatures = new ApiFeatures(countBase, req.query).search().filter();
    const totalDocs = await countFeatures.query.countDocuments();

    features.paginate();
    const earthquakes = await features.query;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const pagination = getPaginationMeta(totalDocs, page, limit);

    return res.status(200).json({ success: true, count: earthquakes.length, pagination, data: earthquakes });
  } catch (error) { next(error); }
};

export const getEarthquakeById = async (req, res, next) => {
  try {
    const earthquake = await Earthquake.findById(req.params.id);
    if (!earthquake) return res.status(404).json({ success: false, error: `Earthquake not found: ${req.params.id}` });
    return res.status(200).json({ success: true, data: earthquake });
  } catch (error) { next(error); }
};

export const createEarthquake = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.magnitude !== undefined && payload.depth !== undefined) {
      payload.riskLevel = calculateRiskDetails(payload.magnitude, payload.depth).riskLevel;
    }
    if (!payload.time) payload.time = new Date();
    const earthquake = await Earthquake.create(payload);
    await alertService.processEarthquakeTriggers(earthquake);
    return res.status(201).json({ success: true, data: earthquake });
  } catch (error) { next(error); }
};

export const replaceEarthquake = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.magnitude !== undefined && payload.depth !== undefined) {
      payload.riskLevel = calculateRiskDetails(payload.magnitude, payload.depth).riskLevel;
    }
    const earthquake = await Earthquake.findByIdAndUpdate(req.params.id, payload, {
      new: true, runValidators: true, overwrite: true,
    });
    if (!earthquake) return res.status(404).json({ success: false, error: `Earthquake not found: ${req.params.id}` });
    return res.status(200).json({ success: true, data: earthquake });
  } catch (error) { next(error); }
};

export const updateEarthquake = async (req, res, next) => {
  try {
    let earthquake = await Earthquake.findById(req.params.id);
    if (!earthquake) return res.status(404).json({ success: false, error: `Earthquake not found: ${req.params.id}` });
    const updates = { ...req.body };
    const mag = updates.magnitude !== undefined ? updates.magnitude : earthquake.magnitude;
    const dep = updates.depth !== undefined ? updates.depth : earthquake.depth;
    updates.riskLevel = calculateRiskDetails(mag, dep).riskLevel;
    earthquake = await Earthquake.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    await alertService.processEarthquakeTriggers(earthquake);
    return res.status(200).json({ success: true, data: earthquake });
  } catch (error) { next(error); }
};

export const deleteEarthquake = async (req, res, next) => {
  try {
    const earthquake = await Earthquake.findByIdAndDelete(req.params.id);
    if (!earthquake) return res.status(404).json({ success: false, error: `Earthquake not found: ${req.params.id}` });
    return res.status(200).json({ success: true, data: {}, message: 'Earthquake record deleted.' });
  } catch (error) { next(error); }
};

export const checkEarthquakeExists = async (req, res, next) => {
  try {
    const exists = await Earthquake.exists({ _id: req.params.id });
    return res.status(200).json({ success: true, exists: !!exists });
  } catch (error) { next(error); }
};

export const bulkCreate = async (req, res, next) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ success: false, error: 'Provide an array of earthquake records.' });
    const prepared = records.map((r) => {
      if (r.magnitude !== undefined && r.depth !== undefined)
        r.riskLevel = calculateRiskDetails(r.magnitude, r.depth).riskLevel;
      if (r.latitude !== undefined && r.longitude !== undefined)
        r.location = { type: 'Point', coordinates: [r.longitude, r.latitude] };
      return r;
    });
    const result = await Earthquake.insertMany(prepared, { ordered: false });
    return res.status(201).json({ success: true, count: result.length, data: result });
  } catch (error) { next(error); }
};

export const bulkUpdate = async (req, res, next) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) return res.status(400).json({ success: false, error: 'Provide filter and update objects.' });
    const result = await Earthquake.updateMany(filter, update, { runValidators: true });
    return res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) { next(error); }
};

export const bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0)
      return res.status(400).json({ success: false, error: 'Provide an array of IDs.' });
    const result = await Earthquake.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (error) { next(error); }
};

const paginatedFind = async (req, res, next, filter, label) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const sortField = req.query.sort || '-time';
    const totalDocs = await Earthquake.countDocuments(filter);
    const data = await Earthquake.find(filter).sort(sortField).skip(skip).limit(limit);
    return res.status(200).json({
      success: true, count: data.length, pagination: getPaginationMeta(totalDocs, page, limit), data,
    });
  } catch (error) { next(error); }
};

export const getByPlace = (req, res, next) =>
  paginatedFind(req, res, next, { place: new RegExp(req.params.place, 'i') });

export const getByCountry = (req, res, next) =>
  paginatedFind(req, res, next, { place: new RegExp(req.params.country, 'i') });

export const getByType = (req, res, next) =>
  paginatedFind(req, res, next, { type: req.params.type });

export const getByStatus = (req, res, next) =>
  paginatedFind(req, res, next, { status: req.params.status });

export const getByMagType = (req, res, next) =>
  paginatedFind(req, res, next, { magType: req.params.magType });

export const getByNetwork = (req, res, next) =>
  paginatedFind(req, res, next, { net: req.params.net });

export const getByMagnitude = (req, res, next) => {
  const mag = parseFloat(req.params.mag);
  if (isNaN(mag)) return res.status(400).json({ success: false, error: 'Invalid magnitude value.' });
  return paginatedFind(req, res, next, { magnitude: { $gte: mag, $lt: mag + 0.5 } });
};

export const getByDepth = (req, res, next) => {
  const d = parseFloat(req.params.depth);
  if (isNaN(d)) return res.status(400).json({ success: false, error: 'Invalid depth value.' });
  return paginatedFind(req, res, next, { depth: { $gte: d - 10, $lte: d + 10 } });
};

export const getByDate = (req, res, next) => {
  const d = new Date(req.params.date);
  if (isNaN(d.getTime())) return res.status(400).json({ success: false, error: 'Invalid date format.' });
  const nextDay = new Date(d); nextDay.setDate(nextDay.getDate() + 1);
  return paginatedFind(req, res, next, { time: { $gte: d, $lt: nextDay } });
};

export const getByYear = (req, res, next) => {
  const y = parseInt(req.params.year, 10);
  if (isNaN(y)) return res.status(400).json({ success: false, error: 'Invalid year.' });
  return paginatedFind(req, res, next, { time: { $gte: new Date(`${y}-01-01`), $lt: new Date(`${y + 1}-01-01`) } });
};

export const getByMonth = (req, res, next) => {
  const m = parseInt(req.params.month, 10);
  if (isNaN(m) || m < 1 || m > 12) return res.status(400).json({ success: false, error: 'Invalid month (1-12).' });
  return paginatedFind(req, res, next, { $expr: { $eq: [{ $month: '$time' }, m] } });
};

export const getHighMagnitude = (req, res, next) =>
  paginatedFind(req, res, next, { magnitude: { $gte: 6.0 } });

export const getLowMagnitude = (req, res, next) =>
  paginatedFind(req, res, next, { magnitude: { $lt: 5.0 } });

export const getDeep = (req, res, next) =>
  paginatedFind(req, res, next, { depth: { $gte: 300 } });

export const getShallow = (req, res, next) =>
  paginatedFind(req, res, next, { depth: { $lte: 70 } });

export const getRecent = (req, res, next) => {
  const since = new Date(); since.setDate(since.getDate() - 30);
  return paginatedFind(req, res, next, { time: { $gte: since } });
};

export const getReviewed = (req, res, next) =>
  paginatedFind(req, res, next, { status: 'reviewed' });

export const getHighGap = (req, res, next) =>
  paginatedFind(req, res, next, { gap: { $gte: 180 } });

export const getHighRms = (req, res, next) =>
  paginatedFind(req, res, next, { rms: { $gte: 1.0 } });

export const getOceanic = (req, res, next) =>
  paginatedFind(req, res, next, {
    place: { $regex: /ridge|rise|ocean|sea\b|mid-atlantic|pacific/i },
  });

export const getCritical = (req, res, next) =>
  paginatedFind(req, res, next, { riskLevel: 'Critical' });

export const sortByMagnitudeDesc = async (req, res, next) => {
  req.query.sort = '-magnitude';
  return getEarthquakes(req, res, next);
};

export const sortByTimeDesc = async (req, res, next) => {
  req.query.sort = '-time';
  return getEarthquakes(req, res, next);
};

export const getRandomEarthquake = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([{ $sample: { size: 1 } }]);
    return res.status(200).json({ success: true, data: data[0] || null });
  } catch (error) { next(error); }
};

export const importJson = async (req, res, next) => {
  try {
    const records = req.body;
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ success: false, error: 'Provide a valid JSON array of earthquake records.' });
    const prepared = records.map((r) => {
      const lat = parseFloat(r.latitude); const lng = parseFloat(r.longitude);
      const mag = parseFloat(r.mag || r.magnitude); const depth = parseFloat(r.depth);
      return {
        time: new Date(r.time), latitude: lat, longitude: lng, depth,
        magnitude: mag, magType: r.magType, nst: r.nst ? parseFloat(r.nst) : null,
        gap: r.gap ? parseFloat(r.gap) : null, dmin: r.dmin ? parseFloat(r.dmin) : null,
        rms: r.rms ? parseFloat(r.rms) : null, net: r.net, place: r.place,
        type: r.type || 'earthquake', horizontalError: r.horizontalError ? parseFloat(r.horizontalError) : undefined,
        depthError: r.depthError ? parseFloat(r.depthError) : undefined,
        magError: r.magError ? parseFloat(r.magError) : undefined,
        magNst: r.magNst ? parseFloat(r.magNst) : null, status: r.status,
        locationSource: r.locationSource, magSource: r.magSource,
        updated: r.updated ? new Date(r.updated) : undefined,
        location: { type: 'Point', coordinates: [lng, lat] },
        riskLevel: (!isNaN(mag) && !isNaN(depth)) ? calculateRiskDetails(mag, depth).riskLevel : 'Moderate',
      };
    });
    const result = await Earthquake.insertMany(prepared, { ordered: false });
    return res.status(201).json({ success: true, imported: result.length });
  } catch (error) { next(error); }
};
