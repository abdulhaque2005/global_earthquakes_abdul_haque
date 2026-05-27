import Earthquake from '../models/Earthquake.js';

export const getStatsOverview = async (req, res, next) => {
  try {
    const [totalCount, avgResult, highest, deepest] = await Promise.all([
      Earthquake.countDocuments(),
      Earthquake.aggregate([{ $group: { _id: null, avgMagnitude: { $avg: '$magnitude' }, avgDepth: { $avg: '$depth' } } }]),
      Earthquake.findOne().sort('-magnitude').select('place magnitude depth time riskLevel'),
      Earthquake.findOne().sort('-depth').select('place magnitude depth time riskLevel'),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalEarthquakes: totalCount,
        averageMagnitude: avgResult[0]?.avgMagnitude || 0,
        averageDepth: avgResult[0]?.avgDepth || 0,
        highestMagnitude: highest,
        deepestEarthquake: deepest,
      },
    });
  } catch (error) { next(error); }
};

export const getCount = async (req, res, next) => {
  try {
    const count = await Earthquake.countDocuments();
    return res.status(200).json({ success: true, data: { count } });
  } catch (error) { next(error); }
};

export const getHighestMagnitude = async (req, res, next) => {
  try {
    const data = await Earthquake.findOne().sort('-magnitude').limit(1);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getDeepest = async (req, res, next) => {
  try {
    const data = await Earthquake.findOne().sort('-depth').limit(1);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getAverageDepth = async (req, res, next) => {
  try {
    const result = await Earthquake.aggregate([{ $group: { _id: null, avgDepth: { $avg: '$depth' } } }]);
    return res.status(200).json({ success: true, data: { averageDepth: result[0]?.avgDepth || 0 } });
  } catch (error) { next(error); }
};

export const getAverageMagnitude = async (req, res, next) => {
  try {
    const result = await Earthquake.aggregate([{ $group: { _id: null, avgMagnitude: { $avg: '$magnitude' } } }]);
    return res.status(200).json({ success: true, data: { averageMagnitude: result[0]?.avgMagnitude || 0 } });
  } catch (error) { next(error); }
};

export const getCountryCount = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $addFields: { country: { $arrayElemAt: [{ $split: ['$place', ', '] }, -1] } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const getTypeCount = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getNetworkCount = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: '$net', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getReviewedCount = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getMonthlyCount = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: { year: { $year: '$time' }, month: { $month: '$time' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 60 },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};
