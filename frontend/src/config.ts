// API configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    SEND_OTP: '/auth/send-otp',
    CHANGE_PASSWORD: '/auth/change-password'
  }
};

// User types
export enum UserType {
  ADMIN = 1,
  COMPANY = 2,
  SEEKER = 3
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user'
}; 