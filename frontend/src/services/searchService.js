import api from './api';
export const searchService = {
  searchEarthquakes: async (query) => {
    try {
      const response = await api.get(`/search/earthquakes?q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching earthquakes:', error);
      throw error;
    }
  }
};
