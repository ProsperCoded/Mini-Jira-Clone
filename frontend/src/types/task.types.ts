// Import task types from the API file
export type {
  Task,
  TaskPriority,
  TaskStatus,
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryParams,
  TaskStats,
  ReorderTaskDto,
} from "../api/task.api";

import type { Task, TaskStatus, TaskPriority } from "../api/task.api";

// Additional frontend-specific types
export type TaskColumn = {
  id: TaskStatus;
  title: string;
  tasks: Task[];
};

export type TaskFilters = {
  search: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  creatorId?: string;
};

export type TaskModalMode = "create" | "edit" | "view";

export type TaskFormData = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  teamId: string;
};
