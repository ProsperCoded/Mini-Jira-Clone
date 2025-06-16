import {
  Prisma,
  Team,
  TeamMember,
  User,
  TeamType,
  UserRole,
} from '@prisma/client';

// Request Types
export type CreateTeamRequest = {
  name: string;
  description?: string;
  type: TeamType;
};

export type UpdateTeamRequest = {
  name?: string;
  description?: string;
  type?: TeamType;
};

// Response Types
export type TeamResponse = {
  id: string;
  name: string;
  description?: string;
  type: TeamType;
  joinCode?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  owner: Pick<User, 'id' | 'username'> & {
    firstName?: string;
    lastName?: string;
  };
  memberCount: number;
  taskCount: number;
};

export type TeamMemberResponse = {
  id: string;
  role: UserRole;
  joinedAt: Date;
  user: Pick<User, 'id' | 'username' | 'email'> & {
    firstName?: string;
    lastName?: string;
  };
};

export type JoinTeamRequest = {
  teamId?: string; // For public teams
  joinCode?: string; // For private teams
};

export type InviteUserRequest = {
  username: string;
  role?: UserRole;
};

export type TeamStats = {
  totalMembers: number;
  totalTasks: number;
  tasksByStatus: {
    todo: number;
    inProgress: number;
    done: number;
  };
  recentActivity: number; // tasks created/updated in last 7 days
};

export interface TeamMemberWithUser {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: Date;
  user: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface TeamWithMembers {
  id: string;
  name: string;
  description?: string;
  type: 'PUBLIC' | 'PRIVATE';
  joinCode?: string;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  members: TeamMemberWithUser[];
  _count?: {
    members: number;
    tasks: number;
  };
}

export interface TeamSummary {
  id: string;
  name: string;
  description?: string;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: Date;
  memberCount: number;
  taskCount: number;
  owner: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface CreateTeamData {
  name: string;
  description?: string;
  type: 'PUBLIC' | 'PRIVATE';
}

export interface JoinTeamData {
  teamId?: string;
  joinCode?: string;
}

// Query Types
export type TeamQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
};
