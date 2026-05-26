import Earthquake from '../models/Earthquake.js';

class AnalyticsService {

  async getMagnitudeDistribution() {
    return await Earthquake.aggregate([
      {
        $bucket: {
          groupBy: '$magnitude',
          boundaries: [0, 2, 4, 5, 6, 7, 8, 10],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgDepth: { $avg: '$depth' },
            maxMagnitude: { $max: '$magnitude' },
          },
        },
      },
    ]);
  }

  async getTopCountries(limit = 10) {
    return await Earthquake.aggregate([
      {

        $addFields: {
          country: {
            $cond: {
              if: { $regexMatch: { input: '$place', regex: /,/ } },
              then: { $arrayElemAt: [{ $split: ['$place', ', '] }, -1] },
              else: '$place',
            },
          },
        },
      },
      {
        $group: {
          _id: { $trim: { input: '$country' } },
          totalQuakes: { $sum: 1 },
          avgMagnitude: { $avg: '$magnitude' },
          maxMagnitude: { $max: '$magnitude' },
        },
      },
      { $sort: { totalQuakes: -1 } },
      { $limit: limit },
    ]);
  }

  async getRiskZones() {
    return await Earthquake.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 },
          avgMagnitude: { $avg: '$magnitude' },
          avgDepth: { $avg: '$depth' },
        },
      },
      {

        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'Critical'] }, then: 1 },
                { case: { $eq: ['$_id', 'High'] }, then: 2 },
                { case: { $eq: ['$_id', 'Moderate'] }, then: 3 },
                { case: { $eq: ['$_id', 'Low'] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      },
      { $sort: { sortOrder: 1 } },
      { $project: { sortOrder: 0 } },
    ]);
  }

  async getYearlyTrends() {
    return await Earthquake.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$time' },
            month: { $month: '$time' },
          },
          count: { $sum: 1 },
          avgMagnitude: { $avg: '$magnitude' },
          maxMagnitude: { $max: '$magnitude' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);
  }
}

export default new AnalyticsService();
