import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle,
  Circle,
  Play,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
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

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
    >
      <Card
        className={cn(
          "h-full hover:shadow-md transition-shadow cursor-pointer",
          isDragging && "opacity-50 scale-95"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
              {task.title}
            </h3>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge
                variant="outline"
                className={cn("text-xs", priorityConfig[task.priority].color)}
              >
                <PriorityIcon className="w-3 h-3 mr-1" />
                {task.priority}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Team and Status */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <span className="truncate">{task.team.name}</span>
            </div>

            <Badge
              variant="outline"
              className={cn("text-xs", statusConfig[task.status].color)}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[task.status].label}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
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
                {isOverdue && <AlertCircle className="w-3 h-3 text-red-500" />}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
