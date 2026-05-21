import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendOtp,
} from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validation.middleware.js';
import {
  registerValidation,
  loginValidation,
} from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', protect, changePassword);

router.post('/verify-email', verifyEmail);
router.post('/send-otp', sendOtp);

export default router;
