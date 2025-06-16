# Backend Setup Documentation

## Overview

This is the backend for the Mini Jira Clone application built with NestJS, Prisma, and PostgreSQL.

## 🚀 Technologies Used

- **NestJS**: Modern Node.js framework for building scalable server-side applications
- **Prisma**: Next-generation ORM for type-safe database access
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **WebSockets**: Real-time communication
- **class-validator**: Request validation
- **cookie-parser**: HTTP cookie parsing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/               # Configuration files
│   │   └── app.config.ts     # Environment configuration with validation
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.types.ts     # Authentication-related types
│   │   ├── task.types.ts     # Task-related types
│   │   └── team.types.ts     # Team-related types
│   ├── utils/                # Utility functions and services
│   │   ├── prisma.service.ts # Prisma database service
│   │   ├── password.util.ts  # Password hashing utilities
│   │   ├── response.util.ts  # API response utilities
│   │   └── validation.util.ts # Validation utilities
│   ├── modules/              # Feature modules (to be created)
│   ├── main.ts               # Application entry point
│   ├── app.module.ts         # Root application module
│   ├── app.controller.ts     # Root controller
│   └── app.service.ts        # Root service
├── prisma/
│   └── schema.prisma         # Database schema
├── docs/                     # Documentation
├── env.example               # Environment variables example
└── package.json              # Dependencies and scripts
```

## 🗄️ Database Schema

### User Model

- **id**: Unique identifier (CUID)
- **email**: Unique email address
- **username**: Unique username
- **password**: Hashed password
- **firstName**: Optional first name
- **lastName**: Optional last name
- **createdAt/updatedAt**: Timestamps

### Team Model

- **id**: Unique identifier (CUID)
- **name**: Team name
- **description**: Optional description
- **type**: PUBLIC or PRIVATE
- **joinCode**: Unique code for private teams
- **ownerId**: Reference to team owner
- **createdAt/updatedAt**: Timestamps

### TeamMember Model

- **id**: Unique identifier (CUID)
- **role**: ADMIN or MEMBER
- **userId**: Reference to user
- **teamId**: Reference to team
- **joinedAt/updatedAt**: Timestamps

### Task Model

- **id**: Unique identifier (CUID)
- **title**: Task title
- **description**: Optional description
- **priority**: LOW, MEDIUM, HIGH
- **status**: TODO, IN_PROGRESS, DONE
- **teamId**: Reference to team
- **creatorId**: Reference to task creator
- **assigneeId**: Optional reference to assignee
- **createdAt/updatedAt**: Timestamps

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mini_jira_clone?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS Configuration
FRONTEND_URL="http://localhost:3000"

# Cookie Configuration
COOKIE_SECRET="your-cookie-secret-here"
```

### Configuration Features

- **Validation**: Environment variables are validated on startup
- **Type Safety**: Configuration is typed with class-validator
- **Global Access**: Configuration is available throughout the application

## 🛠️ Utilities

### PrismaService

- Extends PrismaClient with connection management
- Implements lifecycle hooks for graceful shutdown
- Provides database cleaning for testing
- Includes query logging

### PasswordUtil

- **hash()**: Hash passwords with bcrypt (12 salt rounds)
- **compare()**: Compare plain text with hashed passwords
- **validatePassword()**: Validate password strength

### ResponseUtil

- **success()**: Create success responses
- **error()**: Create error responses
- **validationError()**: Create validation error responses
- **paginated()**: Create paginated responses
- **unauthorized/forbidden/notFound/conflict()**: HTTP status responses

### ValidationUtil

- **isValidEmail()**: Email format validation
- **isValidUsername()**: Username format validation
- **isValidTeamName()**: Team name validation
- **isValidTaskTitle()**: Task title validation
- **validatePagination()**: Pagination parameter validation
- **sanitizeString()**: Input sanitization
- **isValidUUID/isValidCUID()**: ID format validation

## 🔐 Authentication Strategy

The application will use:

- **JWT tokens** for stateless authentication
- **HttpOnly cookies** for secure token storage
- **Role-based access control** (Admin/Member)
- **Password strength validation**
- **Secure password hashing** with bcrypt

## 📡 API Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}
```

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Setup environment**:

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Setup database**:

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed database
   npx prisma db seed
   ```

4. **Start development server**:
   ```bash
   pnpm run start:dev
   ```

## 📋 Next Steps

The following modules need to be implemented:

### 1. Authentication Module (`src/modules/auth/`)

- User registration and login
- JWT strategy and guards
- Password reset functionality

### 2. Users Module (`src/modules/users/`)

- User profile management
- User search functionality

### 3. Teams Module (`src/modules/teams/`)

- Team creation and management
- Team member management
- Join team functionality

### 4. Tasks Module (`src/modules/tasks/`)

- Task CRUD operations
- Task assignment and status updates
- Task filtering and sorting

### 5. WebSocket Gateway (`src/modules/websockets/`)

- Real-time task updates
- Team notifications
- User presence

## 🔄 Development Workflow

1. Create feature modules in `src/modules/`
2. Use the naming convention: `[name].[purpose].ts`
3. Implement services in modules for business logic
4. Use DTOs for request/response validation
5. Leverage the utility functions for common operations
6. Follow the consistent API response format
7. Add comprehensive error handling
8. Write unit tests for services
9. Document new features in this directory

## 🛡️ Security Considerations

- Environment variables are validated
- Passwords are hashed with strong salt rounds
- JWT tokens use secure secrets
- Input validation and sanitization
- CORS configuration for frontend
- HttpOnly cookies for token storage
- Role-based access control

## 📝 Notes

- The database uses CUID for primary keys
- All timestamps are handled automatically by Prisma
- Soft deletes can be implemented if needed
- The application supports both development and production environments
- Database queries are logged in development mode
