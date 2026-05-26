import User from '../models/User.js';
import Earthquake from '../models/Earthquake.js';
import Alert from '../models/Alert.js';
import Report from '../models/Report.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role target specified. Supported values: 'user', 'admin'.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found corresponding to identifier: ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: `User permissions updated successfully to: ${role}`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {

    if (req.user && req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        error: 'Action restricted: Cannot self-terminate logged-in admin identity.',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User not found corresponding to identifier: ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {},
      message: 'User profile revoked and permanently cleared.',
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemStats = async (req, res, next) => {
  try {
    const [totalUsers, totalEarthquakes, totalAlerts, totalReports] = await Promise.all([
      User.countDocuments(),
      Earthquake.countDocuments(),
      Alert.countDocuments(),
      Report.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        systemHealth: 'Optimal',
        totalUsers,
        totalEarthquakes,
        totalAlerts,
        totalReports,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};
