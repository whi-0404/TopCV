import api from './api';
import { API_CONFIG, STORAGE_KEYS } from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userTypeId: number;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
  userImage?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  profileDescription?: string;
  establishmentDate?: string;
  companyWebsiteUrl?: string;
  companyEmail?: string;
  companyLogoUrl?: string;
  address?: string;
  companySize?: string;
  industry?: string;
  taxCode?: string;
  companyImages?: { imageUrl: string; caption: string }[];
}

export interface ChangePasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  userType: string;
  firstName?: string;
  lastName?: string;
  userImage?: string;
  companyName?: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber?: string;
}

const AuthService = {
  login: async (loginRequest: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post(API_CONFIG.AUTH.LOGIN, loginRequest);
    if (response.data.accessToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (registerRequest: RegisterRequest): Promise<string> => {
    const response = await api.post(API_CONFIG.AUTH.REGISTER, registerRequest);
    return response.data;
  },

  sendOtp: async (email: string): Promise<string> => {
    const response = await api.post(`${API_CONFIG.AUTH.SEND_OTP}?email=${email}`);
    return response.data;
  },

  changePassword: async (request: ChangePasswordRequest): Promise<string> => {
    const response = await api.post(API_CONFIG.AUTH.CHANGE_PASSWORD, request);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) !== null;
  }
};

export default AuthService; 