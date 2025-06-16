import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import { taskApi } from "../api/task.api";
import type {
  Task,
  TaskStatus,
  TaskFilters,
  TaskFormData,
  TaskColumn,
} from "../types/task.types";

// State shape
type TaskState = {
  tasks: Task[];
  columns: TaskColumn[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  selectedTask: Task | null;
  currentTeamId: string | null;
};

// Action types
type TaskAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "SET_COLUMNS"; payload: TaskColumn[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<TaskFilters> }
  | { type: "SET_SELECTED_TASK"; payload: Task | null }
  | { type: "SET_CURRENT_TEAM_ID"; payload: string | null }
  | {
      type: "REORDER_TASKS";
      payload: {
        sourceColumn: TaskStatus;
        destColumn: TaskStatus;
        sourceIndex: number;
        destIndex: number;
        taskId: string;
      };
    };

// Initial state
const initialState: TaskState = {
  tasks: [],
  columns: [
    { id: "TODO", title: "To Do", tasks: [] },
    { id: "IN_PROGRESS", title: "In Progress", tasks: [] },
    { id: "DONE", title: "Done", tasks: [] },
  ],
  loading: false,
  error: null,
  filters: {
    search: "",
  },
  selectedTask: null,
  currentTeamId: null,
};

// Reducer function
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        columns: distributeTasksToColumns(action.payload, state.columns),
      };

    case "SET_COLUMNS":
      return { ...state, columns: action.payload };

    case "ADD_TASK":
      const newTasks = [...state.tasks, action.payload];
      return {
        ...state,
        tasks: newTasks,
        columns: distributeTasksToColumns(newTasks, state.columns),
      };

    case "UPDATE_TASK":
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        columns: distributeTasksToColumns(updatedTasks, state.columns),
        selectedTask:
          state.selectedTask?.id === action.payload.id
            ? action.payload
            : state.selectedTask,
      };

    case "DELETE_TASK":
      const filteredTasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
      return {
        ...state,
        tasks: filteredTasks,
        columns: distributeTasksToColumns(filteredTasks, state.columns),
        selectedTask:
          state.selectedTask?.id === action.payload ? null : state.selectedTask,
      };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "SET_SELECTED_TASK":
      return { ...state, selectedTask: action.payload };

    case "SET_CURRENT_TEAM_ID":
      return { ...state, currentTeamId: action.payload };

    case "REORDER_TASKS":
      return handleTaskReorder(state, action.payload);

    default:
      return state;
  }
}

// Helper function to distribute tasks to columns
function distributeTasksToColumns(
  tasks: Task[],
  currentColumns: TaskColumn[]
): TaskColumn[] {
  return currentColumns.map((column) => ({
    ...column,
    tasks: tasks
      .filter((task) => task.status === column.id)
      .sort((a, b) => a.order - b.order),
  }));
}

// Helper function to handle task reordering
function handleTaskReorder(
  state: TaskState,
  payload: {
    sourceColumn: TaskStatus;
    destColumn: TaskStatus;
    sourceIndex: number;
    destIndex: number;
    taskId: string;
  }
): TaskState {
  const { sourceColumn, destColumn, sourceIndex, destIndex, taskId } = payload;

  // Find the task being moved
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return state;

  // Update task status if moving between columns
  const updatedTask = { ...task, status: destColumn };

  // Update tasks array
  const updatedTasks = state.tasks.map((t) =>
    t.id === taskId ? updatedTask : t
  );

  // Redistribute to columns
  const newColumns = distributeTasksToColumns(updatedTasks, state.columns);

  // Handle reordering within the destination column
  if (sourceColumn === destColumn) {
    // Same column reordering
    const column = newColumns.find((col) => col.id === destColumn);
    if (column) {
      const [movedTask] = column.tasks.splice(sourceIndex, 1);
      column.tasks.splice(destIndex, 0, movedTask);
    }
  } else {
    // Different column - just add to the end of destination
    const destCol = newColumns.find((col) => col.id === destColumn);
    if (destCol) {
      // Move to specific position in destination
      const taskInDest = destCol.tasks.find((t) => t.id === taskId);
      if (taskInDest) {
        const currentIndex = destCol.tasks.indexOf(taskInDest);
        const [movedTask] = destCol.tasks.splice(currentIndex, 1);
        destCol.tasks.splice(destIndex, 0, movedTask);
      }
    }
  }

  return {
    ...state,
    tasks: updatedTasks,
    columns: newColumns,
  };
}

// Context type
type TaskContextType = {
  state: TaskState;
  fetchTasks: (teamId: string, filters?: Partial<TaskFilters>) => Promise<void>;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTask: (
    taskId: string,
    newOrder: number,
    newStatus?: TaskStatus
  ) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSelectedTask: (task: Task | null) => void;
  setCurrentTeamId: (teamId: string | null) => void;
  clearError: () => void;
};

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(
    async (teamId: string, filters?: Partial<TaskFilters>) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const queryParams = {
          teamId,
          ...filters,
          sortBy: "order" as const,
          sortOrder: "asc" as const,
        };

        const response = await taskApi.getAll(queryParams);
        dispatch({ type: "SET_TASKS", payload: response.tasks });
        dispatch({ type: "SET_CURRENT_TEAM_ID", payload: teamId });
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to fetch tasks",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  const createTask = useCallback(async (data: TaskFormData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const newTask = await taskApi.create(data);
      dispatch({ type: "ADD_TASK", payload: newTask });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to create task",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateTask = useCallback(
    async (id: string, data: Partial<TaskFormData>) => {
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const updatedTask = await taskApi.update(id, data);
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to update task",
        });
        throw error;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      await taskApi.delete(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to delete task",
      });
      throw error;
    }
  }, []);

  const reorderTask = useCallback(
    async (taskId: string, newOrder: number, newStatus?: TaskStatus) => {
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const reorderData = {
          newOrder,
          ...(newStatus && { newStatus }),
        };

        const updatedTask = await taskApi.reorder(taskId, reorderData);
        dispatch({ type: "UPDATE_TASK", payload: updatedTask });
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to reorder task",
        });
        throw error;
      }
    },
    []
  );

  const setFilters = useCallback((filters: Partial<TaskFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const setSelectedTask = useCallback((task: Task | null) => {
    dispatch({ type: "SET_SELECTED_TASK", payload: task });
  }, []);

  const setCurrentTeamId = useCallback((teamId: string | null) => {
    dispatch({ type: "SET_CURRENT_TEAM_ID", payload: teamId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const value: TaskContextType = {
    state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    setFilters,
    setSelectedTask,
    setCurrentTeamId,
    clearError,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Hook to use the context
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
