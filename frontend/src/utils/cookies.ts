import Cookies from "js-cookie";
import { COOKIE_KEYS } from "../config";

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

// Auth token functions
export const setAuthToken = (token: string): void => {
  Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, COOKIE_OPTIONS);
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
};

export const removeAuthToken = (): void => {
  Cookies.remove(COOKIE_KEYS.AUTH_TOKEN);
};

export const hasAuthToken = (): boolean => {
  return !!getAuthToken();
};

// Clear all auth-related cookies
export const clearAuthCookies = (): void => {
  removeAuthToken();
};
