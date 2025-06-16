# Team Management API Documentation

This document provides comprehensive documentation for the Team Management system APIs.

## Overview

The Team Management system enables users to create, join, and manage teams with role-based access control. It supports both public and private teams with secure join codes.

## Authentication

All team endpoints require JWT authentication. Include the JWT token in the Authorization header or ensure JWT is stored in HttpOnly cookies.

## API Endpoints

### Create Team

**POST** `/teams`

Creates a new team with the authenticated user as the owner.

**Request Body:**

```json
{
  "name": "Team Name",
  "description": "Optional team description",
  "type": "PUBLIC" | "PRIVATE"
}
```

**Response:**

```json
{
  "id": "team_id",
  "name": "Team Name",
  "description": "Optional team description",
  "type": "PUBLIC",
  "joinCode": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "ownerId": "user_id",
  "owner": {
    "id": "user_id",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe"
  },
  "memberCount": 1,
  "taskCount": 0
}
```

### Get Public Teams

**GET** `/teams/public`

Retrieves a paginated list of public teams with optional search functionality.

**Query Parameters:**

- `search` (optional): Search term for team name or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Response:**

```json
{
  "teams": [
    {
      "id": "team_id",
      "name": "Team Name",
      "description": "Team description",
      "type": "PUBLIC",
      "createdAt": "2024-01-15T10:00:00Z",
      "memberCount": 5,
      "taskCount": 12,
      "owner": {
        "id": "user_id",
        "username": "owner_username",
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 3
}
```

### Get User's Teams

**GET** `/teams/my-teams`

Retrieves teams that the authenticated user is a member of.

**Query Parameters:**

- `search` (optional): Search term for team name or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Response:** Same format as Get Public Teams

### Get Team Details

**GET** `/teams/:id`

Retrieves detailed information about a specific team. User must be a member for private teams.

**Response:**

```json
{
  "id": "team_id",
  "name": "Team Name",
  "description": "Team description",
  "type": "PRIVATE",
  "joinCode": "abc123def4",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "ownerId": "user_id",
  "owner": {
    "id": "user_id",
    "username": "owner_username",
    "firstName": "John",
    "lastName": "Doe"
  },
  "memberCount": 5,
  "taskCount": 12
}
```

### Join Team

**POST** `/teams/join`

Allows a user to join a team. For public teams, provide `teamId`. For private teams, provide `joinCode`.

**Request Body:**

```json
{
  "teamId": "team_id", // For public teams
  "joinCode": "abc123" // For private teams
}
```

**Response:**

```json
{
  "id": "member_id",
  "role": "MEMBER",
  "joinedAt": "2024-01-15T10:00:00Z",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Leave Team

**POST** `/teams/:id/leave`

Removes the authenticated user from the specified team. Team owners cannot leave; they must transfer ownership or delete the team.

**Response:** 204 No Content

### Update Team

**PUT** `/teams/:id`

Updates team settings. Only team owners can update teams.

**Request Body:**

```json
{
  "name": "Updated Team Name",
  "description": "Updated description",
  "type": "PRIVATE"
}
```

**Response:** Team object with updated information

### Regenerate Join Code

**POST** `/teams/:id/regenerate-join-code`

Generates a new join code for private teams. Only team owners can regenerate join codes.

**Response:**

```json
{
  "joinCode": "newcode123"
}
```

### Get Team Members

**GET** `/teams/:id/members`

Retrieves all members of a team. User must be a team member to access this endpoint.

**Response:**

```json
[
  {
    "id": "member_id",
    "role": "ADMIN",
    "joinedAt": "2024-01-15T10:00:00Z",
    "user": {
      "id": "user_id",
      "username": "username",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

### Invite User

**POST** `/teams/:id/invite`

Invites a user to join the team by username. Only team admins can invite users.

**Request Body:**

```json
{
  "username": "target_username",
  "role": "MEMBER" // Optional, defaults to MEMBER
}
```

**Response:** Team member object for the invited user

### Remove User

**DELETE** `/teams/:id/members/:userId`

Removes a user from the team. Only team admins can remove users. Team owners cannot be removed.

**Response:** 204 No Content

### Delete Team

**DELETE** `/teams/:id`

Deletes the entire team. Only team owners can delete teams.

**Response:** 204 No Content

### Get Team Statistics

**GET** `/teams/:id/stats`

Retrieves statistical information about the team. User must be a team member to access this endpoint.

**Response:**

```json
{
  "totalMembers": 5,
  "totalTasks": 25,
  "tasksByStatus": {
    "todo": 10,
    "inProgress": 8,
    "done": 7
  },
  "recentActivity": 12
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation error message",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Team not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "You are already a member of this team",
  "error": "Conflict"
}
```

## Data Models

### Team Types

- `PUBLIC`: Anyone can discover and join the team
- `PRIVATE`: Team requires a join code to join

### User Roles

- `ADMIN`: Can manage team settings, invite/remove users, and perform all team operations
- `MEMBER`: Can view team information and tasks but cannot manage team settings

## Business Rules

1. **Team Creation**: Any authenticated user can create teams
2. **Team Ownership**: The creator of a team automatically becomes the owner with ADMIN role
3. **Public Teams**: Can be discovered and joined by any user without invitation
4. **Private Teams**: Require a join code to join and cannot be discovered in public listings
5. **Join Codes**: Automatically generated for private teams and can be regenerated by owners
6. **Role Permissions**: Only ADMINs can invite users, remove users, and update team settings
7. **Owner Restrictions**: Team owners cannot leave teams or be removed by other admins
8. **Team Deletion**: Only team owners can delete teams, which removes all associated data

## Security Considerations

1. **Authentication**: All endpoints require valid JWT authentication
2. **Authorization**: Role-based access control enforced on all team operations
3. **Join Code Security**: Join codes are randomly generated using nanoid for security
4. **Data Privacy**: Private team information is only accessible to team members
5. **Input Validation**: All input data is validated using class-validator decorators
