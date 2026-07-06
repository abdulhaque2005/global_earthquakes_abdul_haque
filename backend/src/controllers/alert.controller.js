import alertService from '../services/alert.service.js';
export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getActiveAlerts(req.query);
    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};
export const createAlert = async (req, res, next) => {
  try {
    const { title, message, magnitude, place, riskLevel, type } = req.body;
    const alert = await alertService.createEmergencyAlert({
      title,
      message,
      magnitude,
      place,
      riskLevel: riskLevel || 'High',
      type: type || 'Emergency',
    });
    return res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};
