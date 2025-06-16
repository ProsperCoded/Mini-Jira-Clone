import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BorderBeam } from "../ui/border-beam";
import { useTaskContext } from "../../contexts/TaskContext";
import type { Task, TaskModalMode, TaskFormData } from "../../types/task.types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: TaskModalMode;
  task?: Task | null;
  teamId: string;
  teamMembers: Array<{
    id: string;
    username: string;
    firstName?: string;
  }>;
}

const initialFormData: TaskFormData = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "TODO",
  assigneeId: "",
  dueDate: "",
  teamId: "",
};

export function TaskModal({
  isOpen,
  onClose,
  mode,
  task,
  teamId,
  teamMembers,
}: TaskModalProps) {
  const { createTask, updateTask, deleteTask, state } = useTaskContext();
  const { loading } = state;
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [title, setTitle] = useState("");

  // Convert ISO string to datetime-local format
  const formatDateTimeLocal = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  // Convert datetime-local format to ISO string
  const formatToISO = (dateTimeLocal: string) => {
    if (!dateTimeLocal) return "";
    return new Date(dateTimeLocal).toISOString();
  };

  useEffect(() => {
    if (isOpen) {
      if (task && (mode === "edit" || mode === "view")) {
        setFormData({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          status: task.status,
          assigneeId: task.assignee?.id || "",
          dueDate: formatDateTimeLocal(task.dueDate || ""),
          teamId: task.teamId,
        });
        setTitle(task.title);
      } else {
        setFormData({ ...initialFormData, teamId });
        setTitle("");
      }
    }
  }, [isOpen, task, mode, teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const submitData: TaskFormData = {
      title: title.trim(),
      description: formData.description || "",
      priority: formData.priority,
      status: formData.status,
      assigneeId:
        formData.assigneeId === "unassigned" ? "" : formData.assigneeId,
      dueDate: formData.dueDate ? formatToISO(formData.dueDate) : "",
      teamId,
    };

    try {
      if (mode === "create") {
        await createTask(submitData);
      } else if (mode === "edit" && task) {
        await updateTask(task.id, submitData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task.id);
        onClose();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full mx-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create New Task"
              : mode === "edit"
              ? "Edit Task"
              : "Task Details"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              disabled={isReadOnly}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter task description..."
              disabled={isReadOnly}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, priority: value as any }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">🟢 Low</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="HIGH">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as any }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">📋 To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">⚡ In Progress</SelectItem>
                  <SelectItem value="DONE">✅ Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={formData.assigneeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, assigneeId: value }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName || member.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date & Time</Label>
              <Input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                disabled={isReadOnly}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {!isReadOnly && (
              <Button
                type="submit"
                disabled={loading}
                className="relative overflow-hidden"
              >
                {loading
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Task"
                  : "Update Task"}
                <BorderBeam
                  size={100}
                  duration={12}
                  colorFrom="#10b981"
                  colorTo="#059669"
                  className="opacity-20"
                />
              </Button>
            )}

            {(mode === "edit" || mode === "view") && task && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            )}

            <Button type="button" variant="outline" onClick={onClose}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
          </div>
        </form>

        <BorderBeam
          size={120}
          duration={18}
          colorFrom="#10b981"
          colorTo="#059669"
          className="opacity-15"
        />
      </DialogContent>
    </Dialog>
  );
}
