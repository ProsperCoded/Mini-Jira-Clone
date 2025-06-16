# Authentication API

This document outlines the API endpoints for user authentication, including registration, login, and profile retrieval.

## Endpoints

### 1. Register a New User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Creates a new user account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "newuser",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": {
        "id": "cuid...",
        "email": "user@example.com",
        "username": "newuser",
        "firstName": "John",
        "lastName": "Doe",
        "createdAt": "...",
        "updatedAt": "..."
      },
      "accessToken": "jwt-token-here"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Invalid input (e.g., weak password, invalid email).
  - `409 Conflict`: Email or username already exists.

### 2. Log In a User

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": { ... },
      "accessToken": "jwt-token-here"
    }
  }
  ```
- **Error Response**:
  - `401 Unauthorized`: Invalid credentials.

### 3. Get User Profile

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Description**: Retrieves the profile of the authenticated user.
- **Authentication**: `Bearer Token` required.
  - Header: `Authorization: Bearer <jwt-token>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully.",
    "data": {
      "id": "cuid...",
      "email": "user@example.com",
      "username": "newuser",
      ...
    }
  }
  ```
- **Error Response**:
  - `401 Unauthorized`: Token is invalid or missing.

## User Profile Utility

A `UserProfileUtil` is available to safely format user objects by removing sensitive data.

- **Location**: `src/utils/user-profile.util.ts`
- **Method**: `formatUserProfile(user: User): AuthUser | null`
- **Description**: Takes a Prisma `User` object and returns an `AuthUser` object without the password. It returns `null` if the input is `null`.
- **Usage**:

  ```typescript
  import { UserProfileUtil } from '../utils/user-profile.util';

  const safeProfile = UserProfileUtil.formatUserProfile(userFromDb);
  ```

This utility ensures that no sensitive user data is accidentally exposed in API responses.
