import Earthquake from '../models/Earthquake.js';
import analyticsService from '../services/analytics.service.js';
import predictionService from '../services/prediction.service.js';

export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const [totalCount, magnitudeDist, riskZones, topCountries] = await Promise.all([
      Earthquake.countDocuments(),
      analyticsService.getMagnitudeDistribution(),
      analyticsService.getRiskZones(),
      analyticsService.getTopCountries(5),
    ]);

    const avgResult = await Earthquake.aggregate([
      { $group: { _id: null, avgMagnitude: { $avg: '$magnitude' }, avgDepth: { $avg: '$depth' }, maxMagnitude: { $max: '$magnitude' } } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalEarthquakes: totalCount,
        averageMagnitude: avgResult[0]?.avgMagnitude || 0,
        averageDepth: avgResult[0]?.avgDepth || 0,
        maxMagnitude: avgResult[0]?.maxMagnitude || 0,
        magnitudeDistribution: magnitudeDist,
        riskZones,
        topCountries,
      },
    });
  } catch (error) { next(error); }
};

export const getMagnitudeAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getMagnitudeDistribution();
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getCountryAnalytics = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await analyticsService.getTopCountries(limit);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const getRiskZoneAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getRiskZones();
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getYearlyTrends = async (req, res, next) => {
  try {
    const data = await analyticsService.getYearlyTrends();
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getRegionalRiskPrediction = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, error: 'Provide lat and lng parameters.' });
    const data = await predictionService.predictRegionSeismicRisk(
      parseFloat(lat), parseFloat(lng), parseFloat(radius) || 100
    );
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const analyzeHighestMagnitude = async (req, res, next) => {
  try {
    const data = await Earthquake.find().sort('-magnitude').limit(20).select('time place magnitude depth riskLevel');
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const analyzeDeepest = async (req, res, next) => {
  try {
    const data = await Earthquake.find().sort('-depth').limit(20).select('time place magnitude depth riskLevel');
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const analyzeRecentActivity = async (req, res, next) => {
  try {
    const since = new Date(); since.setDate(since.getDate() - 30);
    const data = await Earthquake.aggregate([
      { $match: { time: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$time' } }, count: { $sum: 1 }, avgMag: { $avg: '$magnitude' }, maxMag: { $max: '$magnitude' } } },
      { $sort: { _id: -1 } },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const analyzeLocations = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: '$place', count: { $sum: 1 }, avgMag: { $avg: '$magnitude' }, avgDepth: { $avg: '$depth' } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const analyzeCountries = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $addFields: { country: { $arrayElemAt: [{ $split: ['$place', ', '] }, -1] } } },
      { $group: { _id: '$country', count: { $sum: 1 }, avgMag: { $avg: '$magnitude' }, maxMag: { $max: '$magnitude' }, avgDepth: { $avg: '$depth' } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const analyzeNetworks = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: '$net', count: { $sum: 1 }, avgMag: { $avg: '$magnitude' } } },
      { $sort: { count: -1 } },
    ]);
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

export const analyzeMagnitudes = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $bucket: { groupBy: '$magnitude', boundaries: [0, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10], default: '10+', output: { count: { $sum: 1 }, avgDepth: { $avg: '$depth' } } } },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const analyzeDepths = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $bucket: { groupBy: '$depth', boundaries: [0, 30, 70, 150, 300, 500, 700, 1000], default: '1000+', output: { count: { $sum: 1 }, avgMag: { $avg: '$magnitude' }, label: { $first: '$depth' } } } },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const analyzeErrors = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: null, avgHorizontalError: { $avg: '$horizontalError' }, avgDepthError: { $avg: '$depthError' }, avgMagError: { $avg: '$magError' }, maxHorizontalError: { $max: '$horizontalError' }, maxDepthError: { $max: '$depthError' }, maxMagError: { $max: '$magError' } } },
      { $project: { _id: 0 } },
    ]);
    return res.status(200).json({ success: true, data: data[0] || {} });
  } catch (error) { next(error); }
};

export const analyzeMonthly = async (req, res, next) => {
  try {
    const data = await Earthquake.aggregate([
      { $group: { _id: { year: { $year: '$time' }, month: { $month: '$time' } }, count: { $sum: 1 }, avgMag: { $avg: '$magnitude' }, maxMag: { $max: '$magnitude' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 120 },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};
