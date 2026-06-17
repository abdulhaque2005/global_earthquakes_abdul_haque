import api from './api';
export const earthquakeService = {
  getEarthquakes: async (params = {}) => {
    try {
      let queryStr = '?';
      for (const key in params) {
        if (params[key] !== undefined && params[key] !== '') {
          queryStr += `${key}=${params[key]}&`;
        }
      }
      const response = await api.get(`/earthquakes${queryStr.slice(0, -1)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching earthquakes:', error);
      throw error;
    }
  },
  createEarthquake: async (data) => {
    try {
      const response = await api.post('/earthquakes', data);
      return response.data;
    } catch (error) {
      console.error('Error creating earthquake:', error);
      throw error;
    }
  },
  getRecentEarthquakes: async (limit = 100) => {
    return earthquakeService.getEarthquakes({ limit, sort: '-time' });
  },
  getEarthquakeById: async (id) => {
    try {
      const response = await api.get(`/earthquakes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching earthquake by ID:', error);
      throw error;
    }
  },
  getNearby: async (lat, lng, radius = 500, limit = 20) => {
    try {
      const response = await api.get(`/earthquakes?lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby earthquakes:', error);
      throw error;
    }
  }
};
