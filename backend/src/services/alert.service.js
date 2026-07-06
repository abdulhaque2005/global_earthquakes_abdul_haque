import Alert from '../models/Alert.js';
import Notification from '../models/Notification.js';
import { getSocketIo } from '../config/socket.js';
class AlertService {
  async createEmergencyAlert(alertData) {
    const alert = await Alert.create(alertData);
    try {
      const io = getSocketIo();
      if (io) {
        io.emit('emergencyAlert', alert);
      }
    } catch (socketError) {
      console.warn('Real-time propagation bypassed: Socket.IO not yet initialized.');
    }
    try {
      await Notification.create({
        title: `[${alert.type}] ${alert.title}`,
        message: alert.message,
        type: 'Alert',
      });
    } catch (notificationError) {
      console.error('Failed to register broadcast notification record:', notificationError.message);
    }
    return alert;
  }
  async processEarthquakeTriggers(earthquakeDoc) {
    if (earthquakeDoc.magnitude >= 6.0) {
      const alertPayload = {
        title: `Critical Seismic Event: Mag ${earthquakeDoc.magnitude} at ${earthquakeDoc.place}`,
        message: `An earthquake of significant magnitude (${earthquakeDoc.magnitude}) has been registered at depth ${earthquakeDoc.depth}km. Immediate local authority safety measures recommended.`,
        magnitude: earthquakeDoc.magnitude,
        place: earthquakeDoc.place,
        riskLevel: earthquakeDoc.riskLevel === 'Low' ? 'Critical' : earthquakeDoc.riskLevel,
        type: 'Emergency',
        earthquakeId: earthquakeDoc._id,
      };
      await this.createEmergencyAlert(alertPayload);
    }
  }
  async getActiveAlerts(queryFilters = {}) {
    return await Alert.find({ ...queryFilters, status: 'Active' }).sort('-createdAt');
  }
}
export default new AlertService();
