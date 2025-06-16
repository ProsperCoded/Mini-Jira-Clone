import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Lock, Globe, Loader2, Sparkles, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { createTeam } from "../../api/team.api";
import type { CreateTeamRequest, Team } from "../../types/team.types";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: "",
    description: "",
    type: "PUBLIC",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (value: "PUBLIC" | "PRIVATE") => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Team name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Team name must be at least 2 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Team name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const team = await createTeam(formData);
      toast.success(`Team "${team.name}" created successfully!`);

      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "PUBLIC",
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error("Error creating team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create team";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setFormData({
      name: "",
      description: "",
      type: "PUBLIC",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full bg-gradient-to-br from-background to-background/50 backdrop-blur-xl border border-border/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-lg" />

        <div className="relative">
          <DialogHeader className="space-y-6 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Create New Team
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                Start collaborating with your team on amazing projects
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Team Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter team name"
                value={formData.name}
                onChange={handleInputChange}
                className={`h-12 ${errors.name ? "border-destructive" : ""}`}
                disabled={loading}
                required
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What's your team about? (optional)"
                value={formData.description}
                onChange={handleInputChange}
                className={`min-h-[100px] resize-none ${
                  errors.description ? "border-destructive" : ""
                }`}
                disabled={loading}
              />
              <AnimatePresence>
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {errors.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Team Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Team Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
                disabled={loading}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-xs text-muted-foreground">
                          Anyone can discover and join
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="PRIVATE">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-xs text-muted-foreground">
                          Requires join code to access
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>

              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Team
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
