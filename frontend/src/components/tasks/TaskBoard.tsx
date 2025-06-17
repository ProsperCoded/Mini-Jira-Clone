import React, { useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTaskContext } from "../../contexts/TaskContext";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { BorderBeam } from "../ui/border-beam";
import { MagicCard } from "../ui/magic-card";
import type { Task, TaskStatus } from "../../types/task.types";
import { Button } from "../ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TaskBoardProps {
  teamId: string;
  onCreateTask: () => void;
  onTaskClick: (task: Task) => void;
}

export function TaskBoard({
  teamId,
  onCreateTask,
  onTaskClick,
}: TaskBoardProps) {
  const { state, fetchTasks, optimisticReorderTask, setFilters } =
    useTaskContext();
  const { columns, loading, error, filters } = state;

  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (teamId) {
      fetchTasks(teamId, filters);
    }
  }, [teamId, fetchTasks, filters]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = state.tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as string;

    // Find the active task
    const activeTask = state.tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) return;

    // Determine the target column
    let targetColumnId: TaskStatus | null = null;

    if (
      typeof over.id === "string" &&
      ["TODO", "IN_PROGRESS", "DONE"].includes(over.id)
    ) {
      // Dragging over a column
      targetColumnId = over.id as TaskStatus;
    } else {
      // Dragging over another task
      const overTask = state.tasks.find((t) => t.id === over.id);
      if (overTask) {
        targetColumnId = overTask.status;
      }
    }

    // Visual feedback could be added here if needed
    // For now, we'll let the DragOverlay handle the visual feedback
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const activeTask = state.tasks.find((t) => t.id === activeTaskId);

    if (!activeTask) return;

    // Store original position for optimistic update
    const originalStatus = activeTask.status;
    const originalColumn = columns.find((col) => col.id === originalStatus);
    const originalIndex = originalColumn
      ? originalColumn.tasks.findIndex((t) => t.id === activeTaskId)
      : 0;

    // Determine if we're dropping on a column or another task
    let newStatus: TaskStatus;
    let newOrder = 0;
    let destIndex = 0;

    if (
      typeof over.id === "string" &&
      ["TODO", "IN_PROGRESS", "DONE"].includes(over.id)
    ) {
      // Dropped on a column
      newStatus = over.id as TaskStatus;
      const targetColumn = columns.find((col) => col.id === newStatus);
      newOrder = targetColumn ? targetColumn.tasks.length : 0;
      destIndex = newOrder;
    } else {
      // Dropped on another task - find the column and position
      const overTask = state.tasks.find((t) => t.id === over.id);
      if (!overTask) return;

      newStatus = overTask.status;
      const targetColumn = columns.find((col) => col.id === newStatus);
      if (targetColumn) {
        const overTaskIndex = targetColumn.tasks.findIndex(
          (t) => t.id === over.id
        );
        newOrder = overTaskIndex;
        destIndex = overTaskIndex;
      }
    }

    // Only update if something changed
    if (activeTask.status !== newStatus || activeTask.order !== newOrder) {
      try {
        await optimisticReorderTask(
          activeTaskId,
          newOrder,
          newStatus,
          originalStatus,
          newStatus,
          originalIndex,
          destIndex
        );
      } catch (error) {
        console.error("Failed to reorder task:", error);
      }
    }
  };

  const handleSearch = (value: string) => {
    setFilters({ search: value });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({
      status: status === "all" ? undefined : (status as TaskStatus),
    });
  };

  const handlePriorityFilter = (priority: string) => {
    setFilters({
      priority: priority === "all" ? undefined : (priority as any),
    });
  };

  if (loading && !state.tasks.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Error loading tasks: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header with filters and actions */}
      <MagicCard
        className="p-6"
        gradientFrom="#10b981"
        gradientTo="#059669"
        gradientColor="rgba(16, 185, 129, 0.1)"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select onValueChange={handleStatusFilter} defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handlePriorityFilter} defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onCreateTask} className="relative overflow-hidden">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
            <BorderBeam
              size={100}
              duration={18}
              delay={9}
              colorFrom="#10b981"
              colorTo="#059669"
              className="opacity-15"
            />
          </Button>
        </div>
      </MagicCard>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="opacity-90 transform rotate-2 scale-105 shadow-2xl">
                <TaskCard
                  task={activeTask}
                  onClick={() => {}}
                  isDragging={true}
                  className="border-2 border-primary/50"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
