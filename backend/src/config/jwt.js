import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'quakevision_super_secret_jwt_key_2026_secure',
  expiresIn: process.env.JWT_EXPIRES_IN || '30d',
};