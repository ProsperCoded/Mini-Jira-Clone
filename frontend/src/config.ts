export const BASE_URL = "http://localhost:3001";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
  },
  USERS: {
    SEARCH: "/api/users/search",
  },
  TEAMS: {
    BASE: "/api/teams",
    JOIN: "/api/teams/join",
    JOIN_PRIVATE: "/api/teams/join-private",
    MEMBERS: (teamId: string) => `/api/teams/${teamId}/members`,
    USER_TEAM_IDS: "/api/teams/user/team-ids",
  },
  TASKS: {
    BASE: "/api/tasks",
    BY_ID: (taskId: string) => `/api/tasks/${taskId}`,
  },
};

export const COOKIE_KEYS = {
  AUTH_TOKEN: "auth_token",
};
