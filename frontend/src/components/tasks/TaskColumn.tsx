import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { MagicCard } from "../ui/magic-card";
import { BorderBeam } from "../ui/border-beam";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import type {
  TaskColumn as TaskColumnType,
  Task,
} from "../../types/task.types";
import { cn } from "../../lib/utils";

interface TaskColumnProps {
  column: TaskColumnType;
  onTaskClick: (task: Task) => void;
}

const statusConfig = {
  TODO: {
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-500/20",
    gradientFrom: "#3B82F6",
    gradientTo: "#1E40AF",
  },
  IN_PROGRESS: {
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
    borderColor: "border-yellow-500/20",
    gradientFrom: "#F59E0B",
    gradientTo: "#D97706",
  },
  DONE: {
    color: "bg-green-500/10 text-green-700 dark:text-green-300",
    borderColor: "border-green-500/20",
    gradientFrom: "#10B981",
    gradientTo: "#059669",
  },
};

export function TaskColumn({ column, onTaskClick }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const config = statusConfig[column.id];
  const taskIds = column.tasks.map((task) => task.id);

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <Card
        className={cn(
          "mb-4 transition-all duration-200",
          isOver && "ring-2 ring-primary/50 shadow-lg"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  config.color.replace("text-", "bg-").split(" ")[0]
                )}
              />
              {column.title}
            </CardTitle>
            <Badge variant="secondary" className={config.color}>
              {column.tasks.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Drop Zone */}
      <MagicCard
        className={cn(
          "flex-1 p-4 transition-all duration-200 border-2 border-dashed",
          config.borderColor,
          isOver
            ? "border-primary bg-primary/5 scale-105"
            : "border-muted-foreground/20"
        )}
        gradientFrom={config.gradientFrom}
        gradientTo={config.gradientTo}
        gradientOpacity={0.1}
      >
        <div ref={setNodeRef} className="h-full">
          <ScrollArea className="h-full pr-4">
            <SortableContext
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {column.tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <div className="text-4xl mb-2 opacity-50">📋</div>
                    <p className="text-sm text-center">
                      {column.id === "TODO" && "No tasks to do"}
                      {column.id === "IN_PROGRESS" && "No tasks in progress"}
                      {column.id === "DONE" && "No completed tasks"}
                    </p>
                  </div>
                ) : (
                  column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </ScrollArea>
        </div>

        {isOver && (
          <BorderBeam
            size={100}
            duration={8}
            colorFrom="#10b981"
            colorTo="#059669"
            className="opacity-20"
          />
        )}
      </MagicCard>
    </div>
  );
}
