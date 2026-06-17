import api from './api';
export const analyticsService = {
  getSummary: async () => {
    const response = await api.get('/analytics/summary');
    return response.data;
  },
  getMagnitudeAnalytics: async () => {
    const response = await api.get('/analytics/magnitude');
    return response.data;
  },
  getCountryAnalytics: async () => {
    const response = await api.get('/analytics/countries');
    return response.data;
  },
  getRiskZoneAnalytics: async () => {
    const response = await api.get('/analytics/risk-zones');
    return response.data;
  },
  getYearlyTrends: async () => {
    const response = await api.get('/analytics/yearly-trends');
    return response.data;
  },
  getRegionalRiskPrediction: async () => {
    const response = await api.get('/analytics/predict');
    return response.data;
  },
  getHighestMagnitude: async () => {
    const response = await api.get('/analytics/earthquakes/highest-magnitude');
    return response.data;
  },
  getDeepest: async () => {
    const response = await api.get('/analytics/earthquakes/deepest');
    return response.data;
  },
  getRecentActivity: async () => {
    const response = await api.get('/analytics/earthquakes/recent-activity');
    return response.data;
  },
  getLocationAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/location-analysis');
    return response.data;
  },
  getNetworkAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/network-analysis');
    return response.data;
  },
  getDepthAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/depth-analysis');
    return response.data;
  },
  getMonthlyAnalysis: async () => {
    const response = await api.get('/analytics/earthquakes/monthly-analysis');
    return response.data;
  }
};
