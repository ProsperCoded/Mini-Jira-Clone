import apiClient from "./client";
import { API_ENDPOINTS } from "../config";
import type { ApiResponse } from "../types/base.type";
import type {
  Team,
  TeamMember,
  TeamStats,
  CreateTeamRequest,
  JoinTeamRequest,
  InviteUserRequest,
  UpdateTeamRequest,
  TeamQueryParams,
  TeamListResponse,
} from "../types/team.types";

export type TeamType = {
  PUBLIC: "PUBLIC";
  PRIVATE: "PRIVATE";
};

export type UserRole = {
  ADMIN: "ADMIN";
  MEMBER: "MEMBER";
};

export type TeamOwner = {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Create a new team
 */
export const createTeam = async (data: CreateTeamRequest): Promise<Team> => {
  const response = await apiClient.post<ApiResponse<Team>>("/api/teams", data);
  return response.data.data!;
};

/**
 * Get public teams with pagination and search
 */
export const getPublicTeams = async (
  params: TeamQueryParams = {}
): Promise<TeamListResponse> => {
  const response = await apiClient.get<ApiResponse<TeamListResponse>>(
    "/api/teams",
    {
      params,
    }
  );
  return response.data.data!;
};

/**
 * Get user's teams
 */
export const getUserTeams = async (
  params: TeamQueryParams = {}
): Promise<TeamListResponse> => {
  const response = await apiClient.get<ApiResponse<TeamListResponse>>(
    "/api/teams/my-teams",
    {
      params,
    }
  );
  return response.data.data!;
};

/**
 * Get a specific team by ID
 */
export const getTeam = async (teamId: string): Promise<Team> => {
  const response = await apiClient.get<ApiResponse<Team>>(
    `/api/teams/${teamId}`
  );
  return response.data.data!;
};

/**
 * Join a team (public or private)
 */
export const joinTeam = async (data: JoinTeamRequest): Promise<TeamMember> => {
  const response = await apiClient.post<ApiResponse<TeamMember>>(
    "/api/teams/join",
    data
  );
  return response.data.data!;
};

/**
 * Update team details
 */
export const updateTeam = async (
  teamId: string,
  data: UpdateTeamRequest
): Promise<Team> => {
  const response = await apiClient.put<ApiResponse<Team>>(
    `/api/teams/${teamId}`,
    data
  );
  return response.data.data!;
};

/**
 * Get team members
 */
export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const response = await apiClient.get<ApiResponse<TeamMember[]>>(
    `/api/teams/${teamId}/members`
  );
  return response.data.data!;
};

/**
 * Invite a user to the team
 */
export const inviteUser = async (
  teamId: string,
  data: InviteUserRequest
): Promise<TeamMember> => {
  const response = await apiClient.post<ApiResponse<TeamMember>>(
    `/api/teams/${teamId}/members`,
    data
  );
  return response.data.data!;
};

/**
 * Get team statistics
 */
export const getTeamStats = async (teamId: string): Promise<TeamStats> => {
  const response = await apiClient.get<ApiResponse<TeamStats>>(
    `/api/teams/${teamId}/stats`
  );
  return response.data.data!;
};

/**
 * Delete a team (owner only)
 */
export const deleteTeam = async (teamId: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `${API_ENDPOINTS.TEAMS.BASE}/${teamId}`
  );
  return response.data.data!;
};

/**
 * Get user's team IDs for membership checking
 */
export const getUserTeamIds = async (): Promise<string[]> => {
  const response = await apiClient.get<ApiResponse<string[]>>(
    API_ENDPOINTS.TEAMS.USER_TEAM_IDS
  );
  return response.data.data!;
};
