import {
  Prisma,
  Task,
  Team,
  User,
  TaskPriority,
  TaskStatus,
} from '@prisma/client';

// Request Types
export type CreateTaskRequest = {
  title: string;
  description?: string;
  priority: TaskPriority;
  teamId: string;
  assigneeId?: string;
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
};

// Response Types
export type TaskResponse = Task & {
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
  team: {
    id: string;
    name: string;
  };
};

// Query Types
export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  creatorId?: string;
  teamId?: string;
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
  importantTasks: TaskResponse[];
};

export type CreateTaskDto = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: Date;
  teamId: string;
};

export type UpdateTaskDto = {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assigneeId?: string;
  order?: number;
  dueDate?: Date;
};

export type TaskQueryDto = {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  creatorId?: string;
  teamId?: string;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'title'
    | 'priority'
    | 'dueDate'
    | 'order';
  sortOrder?: 'asc' | 'desc';
  dueFrom?: Date;
  dueTo?: Date;
};

export type ReorderTaskDto = {
  taskId: string;
  newOrder: number;
  newStatus?: TaskStatus;
};

export type BulkUpdateTaskDto = {
  taskIds: string[];
  updates: Partial<UpdateTaskDto>;
};
