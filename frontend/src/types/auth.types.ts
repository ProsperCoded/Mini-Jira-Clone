// User data structure
export type User = {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
};

// Authentication request payloads
export type RegisterRequest = {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

// Authentication response data types
export type AuthData = {
  user: User;
  accessToken: string;
};

// Auth context state
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

// Auth context actions
export type AuthContextType = AuthState & {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
};

// Modal states
export type AuthModalState = {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
};

export type AuthModalContextType = AuthModalState & {
  openLogin: () => void;
  openRegister: () => void;
  closeModals: () => void;
  switchToRegister: () => void;
  switchToLogin: () => void;
};
