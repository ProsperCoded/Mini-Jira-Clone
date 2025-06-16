# Authentication API Documentation

This document provides comprehensive information about the authentication system implemented in the Mini Jira Clone project.

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure user authentication. Tokens are stored in HTTP-only cookies on the client side and automatically included in API requests through axios interceptors.

## Base URL

```
BASE_URL: http://localhost:3001
```

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securePassword123",
  "firstName": "John", // Optional
  "lastName": "Doe" // Optional
}
```

**Response (201 Created):**

```json
{
  "user": {
    "id": "cuid_user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Validation errors or user already exists
- `500 Internal Server Error` - Server error

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "cuid_user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid credentials
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

### 3. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Returns the currently authenticated user's information.

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**

```json
{
  "user": {
    "id": "cuid_user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## Frontend Implementation

### Token Management

The frontend uses `js-cookie` library for secure token storage:

```typescript
// Store token after successful login/registration
setAuthToken(response.token);

// Retrieve token for API requests
const token = getAuthToken();

// Remove token on logout
removeAuthToken();
```

### API Client Configuration

The axios client is configured with automatic token injection:

```typescript
// Request interceptor adds auth token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor handles auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
```

### Authentication Context

The `AuthContext` provides authentication state management:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}
```

### Usage Examples

#### Login

```typescript
const { login } = useAuth();

try {
  await login({
    email: "user@example.com",
    password: "password123",
  });
  // User is now logged in
} catch (error) {
  // Handle login error
}
```

#### Register

```typescript
const { register } = useAuth();

try {
  await register({
    email: "newuser@example.com",
    username: "newuser",
    password: "password123",
    firstName: "New",
    lastName: "User",
  });
  // User is now registered and logged in
} catch (error) {
  // Handle registration error
}
```

#### Logout

```typescript
const { logout } = useAuth();

logout(); // Clears token and redirects
```

#### Check Authentication Status

```typescript
const { isAuthenticated, user, isLoading } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (isAuthenticated && user) {
  return <DashboardComponent user={user} />;
}

return <LoginForm />;
```

## Security Considerations

1. **JWT Storage**: Tokens are stored in HTTP-only cookies for security
2. **Token Expiration**: Tokens expire after 7 days by default
3. **Automatic Logout**: Invalid tokens trigger automatic logout
4. **Password Security**: Passwords are hashed using bcrypt on the backend
5. **HTTPS**: Should be used in production for secure token transmission

## Error Handling

The authentication system includes comprehensive error handling:

- **Network Errors**: Handled by axios interceptors
- **Validation Errors**: Displayed in form components
- **Authentication Errors**: Automatic token cleanup and redirect
- **Server Errors**: User-friendly error messages

## Modal System

The authentication UI uses a modal system for login/registration:

```typescript
const { openLogin, openRegister, closeModals } = useAuthModal();

// Open login modal
openLogin();

// Open registration modal
openRegister();

// Switch between modals
switchToRegister();
switchToLogin();

// Close all modals
closeModals();
```

## Component Integration

The navbar automatically adapts based on authentication state:

- **Unauthenticated**: Shows "Sign In" and "Get Started" buttons
- **Authenticated**: Shows user avatar, dropdown menu, and dashboard link
- **Mobile**: Responsive design with mobile-friendly menu

## Future Enhancements

1. **Password Reset**: Email-based password reset functionality
2. **Email Verification**: Account verification via email
3. **Social Login**: OAuth integration (Google, GitHub, etc.)
4. **Two-Factor Authentication**: Enhanced security with 2FA
5. **Session Management**: Advanced session handling and refresh tokens
