# 🚀 Mini Jira Clone - Backend

A robust NestJS backend for a full-featured task management application with team collaboration, real-time updates, and role-based access control.

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication with HttpOnly cookies
- Role-based access control (Admin/Member)
- Secure password hashing with bcrypt (12 salt rounds)
- Password strength validation
- User registration and login

### 👥 Team Management

- Create public and private teams
- Join teams via search (public) or invite codes (private)
- Team member management with roles
- Team statistics and activity tracking

### ✅ Task Management

- Full CRUD operations for tasks
- Task priority levels (Low, Medium, High)
- Task status tracking (To Do, In Progress, Done)
- Task assignment to team members
- Task filtering and sorting capabilities

### 🔔 Real-time Features (Planned)

- WebSocket integration for live updates
- Real-time task status changes
- Team notifications for assignments
- Live collaboration indicators

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Real-time**: WebSockets (Socket.io)
- **Security**: bcrypt, cookie-parser, CORS

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/               # Configuration management
│   │   └── app.config.ts     # Environment variables with validation
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.types.ts     # Authentication types
│   │   ├── task.types.ts     # Task-related types
│   │   └── team.types.ts     # Team-related types
│   ├── utils/                # Utility functions and services
│   │   ├── prisma.service.ts # Database service
│   │   ├── password.util.ts  # Password utilities
│   │   ├── response.util.ts  # API response utilities
│   │   └── validation.util.ts # Validation utilities
│   ├── modules/              # Feature modules (to be implemented)
│   ├── main.ts               # Application bootstrap
│   └── app.module.ts         # Root module
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeding
├── docs/                     # Documentation
└── setup.md                  # Quick setup guide
```

## 🗄️ Database Schema

### Models

**User**

- Authentication and profile information
- Relationships to teams and tasks

**Team**

- Team management with public/private types
- Owner relationship and join codes for private teams

**TeamMember**

- Junction table for team memberships
- Roles (Admin/Member) with timestamps

**Task**

- Task management with full metadata
- Priority, status, and assignment tracking
- Team and creator relationships

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Setup environment**:

   ```bash
   cp env.example .env
   # Edit .env with your database configuration
   ```

3. **Database setup**:

   ```bash
   pnpm run db:generate    # Generate Prisma client
   pnpm run db:migrate     # Run migrations
   pnpm run db:seed        # Seed with demo data (optional)
   ```

4. **Start development**:
   ```bash
   pnpm run dev
   ```

Server will be available at `http://localhost:3001/api`

## 📋 Available Scripts

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `pnpm run dev`         | Start development server with Prisma generation |
| `pnpm run start:dev`   | Start development server (watch mode)           |
| `pnpm run build`       | Build for production                            |
| `pnpm run start:prod`  | Start production server                         |
| `pnpm run db:generate` | Generate Prisma client                          |
| `pnpm run db:migrate`  | Run database migrations                         |
| `pnpm run db:studio`   | Open Prisma Studio (database GUI)               |
| `pnpm run db:seed`     | Seed database with demo data                    |
| `pnpm run db:reset`    | Reset database and run migrations               |
| `pnpm run lint`        | Run ESLint                                      |
| `pnpm run format`      | Format code with Prettier                       |

## 🔧 Configuration

### Environment Variables

Required environment variables (see `env.example`):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mini_jira_clone"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
COOKIE_SECRET="your-cookie-secret"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Features

- **Environment Validation**: All environment variables are validated on startup
- **Type Safety**: Configuration is fully typed with class-validator
- **Global Access**: Configuration available throughout the application
- **Development/Production**: Supports different configurations per environment

## 🛡️ Security Features

- **Password Security**: 12-round bcrypt hashing with strength validation
- **JWT Security**: Secure token generation and validation
- **Input Validation**: Comprehensive request validation with class-validator
- **CORS Protection**: Configured for frontend integration
- **Cookie Security**: HttpOnly cookies for token storage
- **Environment Validation**: Startup validation of critical configuration

## 📊 Utilities

### Response Utilities

Consistent API response format with success/error handling, pagination support, and HTTP status helpers.

### Validation Utilities

- Email format validation
- Username format validation (alphanumeric + special chars)
- Team name validation
- Task title validation
- Pagination parameter validation
- Input sanitization
- ID format validation (UUID/CUID)

### Password Utilities

- Secure password hashing
- Password comparison
- Password strength validation with requirements

## 🔄 Development Workflow

1. **Feature Modules**: Implement in `src/modules/[feature]/`
2. **Naming Convention**: Use `[name].[purpose].ts` format
3. **Services**: Business logic in module services
4. **DTOs**: Request/response validation with class-validator
5. **Types**: Define interfaces in `src/types/`
6. **Utilities**: Common functions in `src/utils/`
7. **Documentation**: Update docs for new features

## 📚 API Design

### Response Format

All API responses follow a consistent format:

```typescript
{
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

### Planned Endpoints

Once modules are implemented:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Teams**: `/api/teams/*`
- **Tasks**: `/api/tasks/*`
- **WebSocket**: Real-time events

## 🧪 Testing

- **Unit Tests**: Jest configuration included
- **E2E Tests**: Test configuration ready
- **Database Testing**: Prisma test utilities available
- **Seed Data**: Demo data for development and testing

## 📈 Performance

- **Database**: Optimized Prisma queries with includes/selects
- **Caching**: Ready for Redis integration
- **Pagination**: Built-in pagination utilities
- **Connection Management**: Proper database connection handling

## 🔄 Next Steps

### Immediate Implementation

1. **Authentication Module**: User registration, login, JWT strategy
2. **Users Module**: Profile management, user search
3. **Teams Module**: Team CRUD, member management, join functionality
4. **Tasks Module**: Task CRUD, assignment, status updates

### Advanced Features

5. **WebSocket Gateway**: Real-time updates and notifications
6. **Email Service**: User invitations and notifications
7. **File Upload**: Task attachments and user avatars
8. **Audit Logging**: Track all user actions
9. **Rate Limiting**: API protection
10. **Caching**: Performance optimization

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Verify DATABASE_URL format and database exists
2. **Environment Variables**: Ensure all required variables are set
3. **Prisma Client**: Run `pnpm run db:generate` after schema changes
4. **Migrations**: Use `pnpm run db:migrate` for schema updates

### Development Tools

- **Prisma Studio**: Visual database browser
- **Database Logs**: Enabled in development mode
- **Error Handling**: Comprehensive error logging
- **Validation Errors**: Detailed validation feedback

## 📄 License

This project is part of the Mini Jira Clone application.

---

**Ready to build amazing task management features!** 🚀

For detailed implementation guides, see the `docs/` directory.
