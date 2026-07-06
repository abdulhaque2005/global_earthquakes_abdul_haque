import api from './api';
export const reportService = {
  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },
  createReport: async (data) => {
    try {
      const response = await api.post('/reports', data);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },
  deleteReport: async (id) => {
    try {
      const response = await api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
};
