# Mini Jira Clone - Team Management System

A comprehensive full-stack task management application with team collaboration features, implementing core Jira-like functionality with modern UI/UX design.

## 🚀 Features Implemented

### ✅ Complete Team Management System

#### Backend Implementation

- **Team CRUD Operations**: Create, read, update, and delete teams
- **Public & Private Teams**: Support for discoverable public teams and invite-only private teams
- **Join Code System**: Secure random join codes for private teams with regeneration capability
- **Role-Based Access Control**: Admin and Member roles with appropriate permissions
- **Team Statistics**: Member count, task count, and activity tracking
- **Member Management**: Invite users, remove members, and manage team settings
- **Search & Pagination**: Server-side search and pagination for team discovery

#### Frontend Implementation

- **Explore Page**: Beautiful team discovery interface with search and filtering
- **Dashboard with Sidebar**:
  - **Home**: Statistics dashboard with activity overview
  - **My Teams**: Paginated list of user's teams with management options
  - **Explore**: Embedded team discovery functionality
  - **Logout**: Secure logout functionality
- **Team Creation Modal**: Elegant form for creating new teams
- **Team Join Modal**: Dual-mode joining (public via ID, private via join code)
- **Responsive Design**: Mobile-friendly interface with collapsible sidebar
- **Dark/Light Mode Support**: Complete theming system

#### Navigation & Routing

- **React Router**: Client-side routing between pages
- **Updated Navbar**: "Teams" replaced with "Explore" link
- **Dashboard Access**: Direct dashboard navigation for authenticated users
- **Authentication Guards**: Protected routes and login prompts

### 🎨 Design System

- **Magic UI Components**: Beautiful glassmorphism team cards with 3D hover effects
- **Framer Motion**: Smooth animations and transitions
- **Tailwind CSS**: Modern responsive design
- **Shadcn/UI**: Consistent component library
- **Toast Notifications**: Real-time feedback system

### 🔒 Security & Authentication

- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Secure session management
- **Role-Based Permissions**: Granular access control
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Secure data handling

## 📊 API Endpoints

### Team Management

```
POST   /teams                    - Create team
GET    /teams/public            - Get public teams (with search & pagination)
GET    /teams/my-teams          - Get user's teams
GET    /teams/:id               - Get team details
POST   /teams/join              - Join team (public/private)
POST   /teams/:id/leave         - Leave team
PUT    /teams/:id               - Update team settings
POST   /teams/:id/regenerate-join-code - Regenerate join code
GET    /teams/:id/members       - Get team members
POST   /teams/:id/invite        - Invite user to team
DELETE /teams/:id/members/:userId - Remove team member
DELETE /teams/:id               - Delete team
GET    /teams/:id/stats         - Get team statistics
```

### Authentication (Existing)

```
POST   /auth/register           - User registration
POST   /auth/login              - User login
POST   /auth/logout             - User logout
```

## 🗄️ Database Schema

### Teams Table

- `id`: Unique identifier
- `name`: Team name (2-50 characters)
- `description`: Optional description (max 500 characters)
- `type`: PUBLIC or PRIVATE
- `joinCode`: Unique join code for private teams
- `ownerId`: Reference to team owner
- `createdAt`/`updatedAt`: Timestamps

### Team Members Table

- `id`: Unique identifier
- `userId`: Reference to user
- `teamId`: Reference to team
- `role`: ADMIN or MEMBER
- `joinedAt`: Join timestamp

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- pnpm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd mini-jira-clone
```

2. **Install dependencies**

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

3. **Environment Setup**

```bash
# Backend (.env)
DATABASE_URL="postgresql://username:password@localhost:5432/mini_jira"
JWT_SECRET="your-jwt-secret"
PORT=3000

# Frontend (.env)
VITE_API_URL="http://localhost:3000"
```

4. **Database Setup**

```bash
cd backend
pnpm db:migrate
pnpm db:generate
```

5. **Start Development Servers**

```bash
# Backend (Terminal 1)
cd backend
pnpm start:dev

# Frontend (Terminal 2)
cd frontend
pnpm dev
```

## 📱 Usage

### Team Management Workflow

1. **Registration/Login**: Users register and log in to access team features
2. **Explore Teams**: Browse public teams on the Explore page
3. **Join Teams**:
   - Public teams: Click "Join Team" button
   - Private teams: Use join code provided by team admin
4. **Create Teams**: Use the "Create Team" button to start a new team
5. **Team Dashboard**: Access team management through the Dashboard sidebar
6. **Manage Members**: Team admins can invite users and manage permissions

### Team Types

#### Public Teams

- Discoverable by all users
- Can be joined directly without invitation
- Visible in search results
- No join code required

#### Private Teams

- Hidden from public discovery
- Require join code to access
- Join codes can be regenerated by team owners
- Invitation-only access

### User Roles

#### Team Owner/Admin

- Full team management privileges
- Can invite and remove members
- Can update team settings
- Can regenerate join codes
- Cannot leave team (must transfer ownership or delete)

#### Team Member

- Can view team information
- Can participate in team activities
- Can leave team voluntarily
- Limited management privileges

## 🛠️ Technology Stack

### Backend

- **NestJS**: Enterprise-grade Node.js framework
- **Prisma ORM**: Type-safe database toolkit
- **PostgreSQL**: Robust relational database
- **JWT**: JSON Web Token authentication
- **class-validator**: Input validation
- **nanoid**: Secure ID generation

### Frontend

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Shadcn/UI**: Modern component library
- **Axios**: HTTP client
- **Sonner**: Toast notifications

### Development Tools

- **pnpm**: Fast package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📂 Project Structure

```
mini-jira-clone/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── users/         # User management
│   │   │   └── teams/         # Team management
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Configuration files
│   ├── prisma/                # Database schema and migrations
│   └── docs/                  # API documentation
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/            # Base UI components
│   │   │   ├── auth/          # Authentication components
│   │   │   └── teams/         # Team-specific components
│   │   ├── pages/             # Application pages
│   │   ├── services/          # API service layer
│   │   ├── contexts/          # React contexts
│   │   └── types/             # TypeScript types
└── README.md                  # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Magic UI**: Beautiful component library for React
- **Shadcn/UI**: Excellent design system
- **Prisma**: Outstanding database toolkit
- **NestJS**: Powerful backend framework
- **Tailwind CSS**: Amazing utility-first CSS framework

---

**Status**: ✅ Team Management System Complete

The team management system has been fully implemented with all requested features including team creation, joining, exploration, dashboard with sidebar, and comprehensive admin controls. The system supports both public and private teams with appropriate security measures and a beautiful, responsive user interface.
