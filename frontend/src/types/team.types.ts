// Import from backend types
export type TeamType = "PUBLIC" | "PRIVATE";
export type UserRole = "ADMIN" | "MEMBER";

export type TeamOwner = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
};

export type TeamMember = {
  id: string;
  role: UserRole;
  joinedAt: string; // ISO date string from API
  user: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  type: TeamType;
  joinCode?: string;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  ownerId: string;
  owner: TeamOwner;
  memberCount: number;
  taskCount: number;
};

export type TeamStats = {
  totalMembers: number;
  totalTasks: number;
  tasksByStatus: {
    [key: string]: number;
  };
  tasksByPriority: {
    [key: string]: number;
  };
  recentActivity: number;
};

// Request Types
export type CreateTeamRequest = {
  name: string;
  description?: string;
  type: TeamType;
};

export type JoinTeamRequest = {
  teamId?: string;
  joinCode?: string;
};

export type InviteUserRequest = {
  username: string;
  role?: UserRole;
};

export type UpdateTeamRequest = {
  name?: string;
  description?: string;
  type?: TeamType;
};

// Query Types
export type TeamQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};

// Response Types
export type TeamListResponse = {
  teams: Team[];
  total: number;
  page: number;
  totalPages: number;
};
