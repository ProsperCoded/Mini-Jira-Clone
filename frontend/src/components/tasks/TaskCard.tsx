import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle,
  Circle,
  Play,
  GripVertical,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTaskContext } from "../../contexts/TaskContext";
import type { Task, TaskPriority, TaskStatus } from "../../api/task.api";
import { cn } from "../../lib/utils";

interface TaskCardProps {
  task: Task;
  className?: string;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  HIGH: {
    color:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    icon: AlertCircle,
  },
  MEDIUM: {
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    icon: Clock,
  },
  LOW: {
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    icon: Circle,
  },
};

const statusConfig = {
  TODO: {
    color:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
    icon: Circle,
    label: "To Do",
  },
  IN_PROGRESS: {
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    icon: Play,
    label: "In Progress",
  },
  DONE: {
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    icon: CheckCircle,
    label: "Done",
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  className,
  onClick,
  isDragging = false,
}) => {
  const { updateTask } = useTaskContext();
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const PriorityIcon = priorityConfig[task.priority].icon;
  const StatusIcon = statusConfig[task.status].icon;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDisplayName = (user: {
    firstName?: string;
    lastName?: string;
    username: string;
  }) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  const handleCheckboxChange = async (checked: boolean) => {
    if (checked && task.status !== "DONE") {
      try {
        await updateTask(task.id, { status: "DONE" });
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    } else if (!checked && task.status === "DONE") {
      try {
        await updateTask(task.id, { status: "TODO" });
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTask(task.id, { status: newStatus });
      setShowStatusSelect(false);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on interactive elements
    if (
      (e.target as HTMLElement).closest(".status-select") ||
      (e.target as HTMLElement).closest("[data-drag-handle]") ||
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[role="checkbox"]')
    ) {
      return;
    }
    onClick?.();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group", className)}
      {...attributes}
    >
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Card
          className={cn(
            "h-full hover:shadow-md transition-shadow cursor-pointer relative",
            (isDragging || isSortableDragging) && "opacity-50 scale-95"
          )}
          onClick={handleCardClick}
        >
          <CardContent className="p-4 space-y-3">
            {/* Header with checkbox and title */}
            <div className="flex items-start gap-2">
              <Checkbox
                checked={task.status === "DONE"}
                onCheckedChange={handleCheckboxChange}
                className="mt-0.5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1 flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    "font-medium text-sm group-hover:text-primary transition-colors line-clamp-2",
                    task.status === "DONE" &&
                      "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      priorityConfig[task.priority].color
                    )}
                  >
                    <PriorityIcon className="w-3 h-3 mr-1" />
                    {task.priority}
                  </Badge>

                  {/* Drag handle */}
                  <div
                    {...listeners}
                    data-drag-handle
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <GripVertical className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <p
                className={cn(
                  "text-xs text-muted-foreground line-clamp-2 ml-6",
                  task.status === "DONE" && "line-through"
                )}
              >
                {task.description}
              </p>
            )}

            {/* Team and Status */}
            <div className="flex items-center justify-between gap-2 ml-6">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                <span className="truncate">{task.team.name}</span>
              </div>

              <div className="status-select">
                <Select
                  value={task.status}
                  onValueChange={handleStatusChange}
                  open={showStatusSelect}
                  onOpenChange={setShowStatusSelect}
                >
                  <SelectTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs cursor-pointer hover:bg-muted/50 transition-colors",
                        statusConfig[task.status].color
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusSelect(!showStatusSelect);
                      }}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[task.status].label}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">
                      <div className="flex items-center gap-2">
                        <Circle className="w-3 h-3" />
                        To Do
                      </div>
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS">
                      <div className="flex items-center gap-2">
                        <Play className="w-3 h-3" />
                        In Progress
                      </div>
                    </SelectItem>
                    <SelectItem value="DONE">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3" />
                        Done
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t ml-6">
              {/* Assignee */}
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate">
                    {getDisplayName(task.assignee)}
                  </span>
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "text-red-500"
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue && (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
