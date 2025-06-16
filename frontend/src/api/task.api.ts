import apiClient from "./client";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  order: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
  team: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  assignee?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
};

export type CreateTaskDto = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  teamId: string;
};

export type UpdateTaskDto = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  order?: number;
  dueDate?: string;
};

export type TaskQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  creatorId?: string;
  teamId?: string;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "title"
    | "priority"
    | "dueDate"
    | "order";
  sortOrder?: "asc" | "desc";
  dueFrom?: string;
  dueTo?: string;
};

export type TaskStats = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  highPriority: number;
  myTasks: number;
};

export type DashboardStats = {
  totalTasks: number;
  completedTasks: number;
  activeTeams: number;
  importantTasks: Task[];
};

export type DashboardStatsParams = {
  importantTasksLimit?: number;
};

export type ReorderTaskDto = {
  newOrder: number;
  newStatus?: TaskStatus;
};

export const taskApi = {
  // Create a new task
  create: async (data: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post("/api/tasks", data);
    return response.data.data;
  },

  // Get tasks with filtering and pagination
  getAll: async (
    params: TaskQueryParams = {}
  ): Promise<{
    tasks: Task[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(
      `/api/tasks?${searchParams.toString()}`
    );
    return response.data.data;
  },

  // Get task by ID
  getById: async (id: string): Promise<Task> => {
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data.data;
  },

  // Update task
  update: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.put(`/api/tasks/${id}`, data);
    return response.data.data;
  },

  // Reorder task (for drag and drop)
  reorder: async (id: string, data: ReorderTaskDto): Promise<Task> => {
    const response = await apiClient.put(`/api/tasks/${id}/reorder`, data);
    return response.data.data;
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/tasks/${id}`);
  },

  // Get task statistics for a team
  getStats: async (teamId: string): Promise<TaskStats> => {
    const response = await apiClient.get(`/api/tasks/stats/${teamId}`);
    return response.data.data;
  },

  // Get dashboard statistics and important tasks
  getDashboardStats: async (
    params: DashboardStatsParams = {}
  ): Promise<DashboardStats> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/tasks/dashboard?${queryString}`
      : "/api/tasks/dashboard";

    const response = await apiClient.get(url);
    return response.data.data;
  },
};
