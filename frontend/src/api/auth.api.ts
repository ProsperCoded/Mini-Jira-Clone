import apiClient from "./client";
import { API_ENDPOINTS } from "../config";
import type {
  LoginRequest,
  RegisterRequest,
  AuthData,
  User,
} from "../types/auth.types";
import type { ApiResponse } from "../types/base.type";

/**
 * Register a new user
 */
export const registerUser = async (
  userData: RegisterRequest
): Promise<ApiResponse<AuthData>> => {
  const response = await apiClient.post<ApiResponse<AuthData>>(
    API_ENDPOINTS.AUTH.REGISTER,
    userData
  );
  return response.data;
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  credentials: LoginRequest
): Promise<ApiResponse<AuthData>> => {
  const response = await apiClient.post<ApiResponse<AuthData>>(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return response.data;
};

/**
 * Get current user information
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.ME
  );
  return response.data;
};

/**
 * Logout user (client-side only - clear token)
 */
export const logoutUser = async (): Promise<void> => {
  // In a real app, you might want to call a logout endpoint
  // For now, we just clear the client-side token
  // The cookie will be cleared by the auth context
  return Promise.resolve();
};
