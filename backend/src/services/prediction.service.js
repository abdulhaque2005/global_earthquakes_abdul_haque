import Earthquake from '../models/Earthquake.js';
import calculateRiskDetails from '../utils/riskCalculator.js';
class PredictionService {
  async predictRegionSeismicRisk(latitude, longitude, radiusKm = 100) {
    const radiusInRadians = radiusKm / 6378.1;
    const historicalQuakes = await Earthquake.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    }).sort('-time');
    const totalEvents = historicalQuakes.length;
    if (totalEvents === 0) {
      return {
        predictionAvailable: true,
        riskStatus: 'Minimal',
        probabilityScore: 5,
        historicalContext: 'No documented seismic activity within this perimeter in the current dataset.',
        metrics: {
          totalEvents: 0,
          avgMagnitude: 0,
          maxMagnitude: 0,
        },
      };
    }
    let sumMagnitude = 0;
    let maxMagnitude = 0;
    let recentEventsCount = 0;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    historicalQuakes.forEach((quake) => {
      sumMagnitude += quake.magnitude;
      if (quake.magnitude > maxMagnitude) {
        maxMagnitude = quake.magnitude;
      }
      if (new Date(quake.time) >= oneYearAgo) {
        recentEventsCount++;
      }
    });
    const avgMagnitude = parseFloat((sumMagnitude / totalEvents).toFixed(2));
    let probabilityScore = Math.min(
      100,
      Math.round(recentEventsCount * 2.5 + maxMagnitude * 8 + (totalEvents > 50 ? 20 : 5))
    );
    let riskStatus = 'Low';
    if (probabilityScore >= 75) {
      riskStatus = 'Critical';
    } else if (probabilityScore >= 50) {
      riskStatus = 'High';
    } else if (probabilityScore >= 25) {
      riskStatus = 'Moderate';
    }
    return {
      predictionAvailable: true,
      riskStatus,
      probabilityScore,
      recommendation:
        riskStatus === 'Critical' || riskStatus === 'High'
          ? 'High probability of clustering/aftershocks. Advise reinforcing structural guidelines.'
          : 'Standard regional continuous monitoring advised.',
      metrics: {
        totalEvents,
        recentEventsPastYear: recentEventsCount,
        avgMagnitude,
        maxMagnitude,
      },
    };
  }
}
export default new PredictionService();
