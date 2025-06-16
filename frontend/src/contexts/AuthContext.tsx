import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type AuthContextType,
  type AuthState,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "../types/auth.types";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../api/auth.api";
import { setAuthToken, getAuthToken, removeAuthToken } from "../utils/cookies";

// Auth actions
type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" }
  | { type: "LOGOUT" };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "LOGOUT":
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const setAuthState = useCallback(
    (user: User | null, error: string | null = null) => {
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error,
      });
    },
    []
  );

  const handleAuthResponse = useCallback(
    (response: { data: { user: User; accessToken: string } }) => {
      const { user, accessToken } = response.data;
      setAuthToken(accessToken);
      setAuthState(user);
    },
    [setAuthState]
  );

  const login = async (credentials: LoginRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await loginUser(credentials);
      handleAuthResponse(response);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred during login";
      setAuthState(null, message);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await registerUser(userData);
      handleAuthResponse(response);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "An error occurred during registration";
      setAuthState(null, message);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      removeAuthToken();
      setAuthState(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear the auth state even if the API call fails
      removeAuthToken();
      setAuthState(null);
    }
  }, [setAuthState]);

  const checkAuth = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setAuthState(null);
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await getCurrentUser();
      console.log("response", response);
      setAuthState(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      removeAuthToken();
      setAuthState(null);
    }
  }, [setAuthState]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Check auth on mount and when token changes
  useEffect(() => {
    const token = getAuthToken();
    console.log("token", token);
    if (token) {
      checkAuth();
    } else {
      setAuthState(null);
    }
  }, [checkAuth, setAuthState]);

  // Set up periodic auth check (every 5 minutes)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [state.isAuthenticated, checkAuth]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
