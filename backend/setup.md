# Backend Quick Setup Guide

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Setup environment variables**:

   ```bash
   cp env.example .env
   ```

   Edit `.env` with your database connection and secrets:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mini_jira_clone?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-here"
   COOKIE_SECRET="your-cookie-secret-here"
   ```

3. **Generate Prisma client**:

   ```bash
   pnpm run db:generate
   ```

4. **Create and migrate database**:

   ```bash
   pnpm run db:migrate
   ```

5. **Seed database with demo data** (optional):

   ```bash
   pnpm run db:seed
   ```

6. **Start development server**:
   ```bash
   pnpm run dev
   ```

## 📋 Available Scripts

- `pnpm run dev` - Start development server with Prisma generation
- `pnpm run start:dev` - Start development server (watch mode)
- `pnpm run build` - Build for production
- `pnpm run start:prod` - Start production server
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:studio` - Open Prisma Studio (database GUI)
- `pnpm run db:seed` - Seed database with demo data
- `pnpm run db:reset` - Reset database and run migrations
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM. The schema includes:

- **Users**: Authentication and user profiles
- **Teams**: Team management with public/private types
- **TeamMembers**: Team membership with roles (Admin/Member)
- **Tasks**: Task management with priority, status, and assignment

## 🔐 Demo Accounts (after seeding)

- **admin@example.com** (password: password123) - Admin user
- **john@example.com** (password: password123) - Developer
- **jane@example.com** (password: password123) - Designer

## 🌐 API Endpoints

The server runs on `http://localhost:3001/api` by default.

Once authentication modules are implemented, you'll have:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task

## 📚 Documentation

Comprehensive documentation is available in `docs/backend-setup.md`

## 🔄 Next Steps

1. Implement authentication module
2. Implement teams module
3. Implement tasks module
4. Add WebSocket support for real-time updates
5. Add comprehensive error handling
6. Add unit and integration tests
