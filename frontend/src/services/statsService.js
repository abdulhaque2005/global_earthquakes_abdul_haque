import api from './api';
export const statsService = {
  getOverview: async () => {
    const response = await api.get('/stats/overview');
    return response.data;
  }
};
