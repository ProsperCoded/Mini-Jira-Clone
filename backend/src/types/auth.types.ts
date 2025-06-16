import { User, UserRole } from '@prisma/client';

export type JwtPayload = {
  sub: string; // user id
  email: string;
  username: string;
  iat?: number;
  exp?: number;
};

export type AuthUser = Pick<
  User,
  | 'id'
  | 'email'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'createdAt'
  | 'updatedAt'
>;

export type TeamMemberInfo = {
  teamId: string;
  role: UserRole;
  joinedAt: Date;
};

export type AuthenticatedUser = AuthUser & {
  teamMemberships: TeamMemberInfo[];
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

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
