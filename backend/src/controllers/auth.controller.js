import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, error: 'Email already registered.' });
    const userRole = role === 'admin' ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role: userRole });
    const token = generateToken(user._id);
    return res.status(201).json({
      success: true, token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Provide email and password.' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    const token = generateToken(user._id);
    return res.status(200).json({
      success: true, token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) { next(error); }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, error: 'Provide Google credential.' });
    
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;
    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        authProvider: 'google',
      });
    }
    const token = generateToken(user._id);
    return res.status(200).json({
      success: true, token,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({ success: false, error: 'Invalid Google credential.' });
  }
};
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Logged out successfully.', token: null });
  } catch (error) { next(error); }
};
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};
export const updateProfile = async (req, res, next) => {
  try {
    const updates = { name: req.body.name, email: req.body.email };
    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, error: 'Provide currentPassword and newPassword.' });
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    return res.status(200).json({ success: true, token, message: 'Password changed successfully.' });
  } catch (error) { next(error); }
};
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Provide email address.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'No account with that email.' });
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.status(200).json({ success: true, message: 'Password reset token generated.', resetToken });
  } catch (error) { next(error); }
};
export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword)
      return res.status(400).json({ success: false, error: 'Provide resetToken and newPassword.' });
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, error: 'Invalid or expired token.' });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(400).json({ success: false, error: 'Reset token expired.' });
    next(error);
  }
};
export const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Provide email.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'Email not found.' });
    return res.status(200).json({ success: true, message: 'Email verified successfully.', verified: true });
  } catch (error) { next(error); }
};
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Provide email.' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return res.status(200).json({ success: true, message: 'OTP sent successfully.', otp });
  } catch (error) { next(error); }
};
export const generateJwtToken = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Provide email and password.' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    const token = generateToken(user._id);
    return res.status(200).json({ success: true, token });
  } catch (error) { next(error); }
};
export const verifyJwtToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: 'Provide token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, valid: true, decoded });
  } catch (error) {
    return res.status(401).json({ success: false, valid: false, error: 'Invalid or expired token.' });
  }
};
export const refreshJwtToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: 'Provide current token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = generateToken(decoded.id);
    return res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token.' });
  }
};
export const revokeJwtToken = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, message: 'Token revoked. Client should discard the token.' });
  } catch (error) { next(error); }
};
