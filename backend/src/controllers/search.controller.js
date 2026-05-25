import Earthquake from '../models/Earthquake.js';
import getPaginationMeta from '../utils/pagination.js';

export const searchRoot = async (req, res, next) => {
  return searchEarthquakes(req, res, next);
};

export const searchEarthquakes = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, error: 'Search query (q) is required.' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const keyword = q.trim();

    const searchFilter = {
      $or: [
        { place: new RegExp(keyword, 'i') },
        { type: new RegExp(keyword, 'i') },
        { status: new RegExp(keyword, 'i') },
        { magType: new RegExp(keyword, 'i') },
        { net: new RegExp(keyword, 'i') },
        { riskLevel: new RegExp(keyword, 'i') },
      ],
    };

    if (/^deep$/i.test(keyword)) {
      Object.assign(searchFilter, { $or: undefined, depth: { $gte: 300 } });
      delete searchFilter.$or;
    } else if (/^high-magnitude$/i.test(keyword)) {
      Object.assign(searchFilter, { $or: undefined, magnitude: { $gte: 6.0 } });
      delete searchFilter.$or;
    } else if (/^critical$/i.test(keyword)) {
      Object.assign(searchFilter, { $or: undefined, riskLevel: 'Critical' });
      delete searchFilter.$or;
    } else if (/^gap$/i.test(keyword)) {
      Object.assign(searchFilter, { $or: undefined, gap: { $gte: 180 } });
      delete searchFilter.$or;
    }

    const totalDocs = await Earthquake.countDocuments(searchFilter);
    const data = await Earthquake.find(searchFilter).sort('-time').skip(skip).limit(limit);
    const pagination = getPaginationMeta(totalDocs, page, limit);

    return res.status(200).json({ success: true, count: data.length, query: keyword, pagination, data });
  } catch (error) { next(error); }
};
