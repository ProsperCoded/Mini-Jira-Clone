import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Globe,
  Lock,
  Loader2,
  Sparkles,
  Search,
  Key,
} from "lucide-react";
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
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { joinTeam } from "../../api/team.api";
import type { JoinTeamRequest } from "../../types/team.types";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type JoinMethod = "choose" | "public" | "private";

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [joinMethod, setJoinMethod] = useState<JoinMethod>("choose");
  const [formData, setFormData] = useState<JoinTeamRequest>({
    teamId: "",
    joinCode: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (joinMethod === "public") {
      if (!formData.teamId?.trim()) {
        newErrors.teamId = "Team ID is required";
      }
    } else if (joinMethod === "private") {
      if (!formData.joinCode?.trim()) {
        newErrors.joinCode = "Join code is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const joinRequest: JoinTeamRequest = {};

      if (joinMethod === "public" && formData.teamId) {
        joinRequest.teamId = formData.teamId;
      } else if (joinMethod === "private" && formData.joinCode) {
        joinRequest.joinCode = formData.joinCode;
      }

      await joinTeam(joinRequest);
      toast.success("Successfully joined the team!");

      // Reset form
      setFormData({
        teamId: "",
        joinCode: "",
      });
      setErrors({});
      setJoinMethod("choose");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error("Error joining team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join team";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setFormData({
      teamId: "",
      joinCode: "",
    });
    setErrors({});
    setJoinMethod("choose");
    onClose();
  };

  const handleMethodSelect = (method: JoinMethod) => {
    setJoinMethod(method);
    setFormData({
      teamId: "",
      joinCode: "",
    });
    setErrors({});
  };

  const renderChooseMethod = () => (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <p className="text-center text-muted-foreground mb-6">
        How would you like to join a team?
      </p>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors"
          onClick={() => handleMethodSelect("public")}
        >
          <div className="flex items-center gap-2 w-full">
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Join Public Team</span>
            <Badge variant="secondary" className="ml-auto">
              Recommended
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Browse and join teams that are open to everyone
          </p>
        </Button>

        <Button
          variant="outline"
          className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50 transition-colors"
          onClick={() => handleMethodSelect("private")}
        >
          <div className="flex items-center gap-2 w-full">
            <Lock className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Join Private Team</span>
          </div>
          <p className="text-sm text-muted-foreground text-left">
            Use a join code to access a private team
          </p>
        </Button>
      </div>
    </motion.div>
  );

  const renderPublicForm = () => (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="text-center">
        <Globe className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Join Public Team</h3>
        <p className="text-sm text-muted-foreground">
          Enter the Team ID to join a public team
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="teamId" className="text-sm font-medium">
          Team ID <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="teamId"
            name="teamId"
            placeholder="Enter team ID"
            value={formData.teamId}
            onChange={handleInputChange}
            className={`pl-10 h-12 ${
              errors.teamId ? "border-destructive" : ""
            }`}
            disabled={loading}
            required
          />
        </div>
        <AnimatePresence>
          {errors.teamId && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-destructive"
            >
              {errors.teamId}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setJoinMethod("choose")}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Join Team
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );

  const renderPrivateForm = () => (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="text-center">
        <Lock className="w-12 h-12 text-purple-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Join Private Team</h3>
        <p className="text-sm text-muted-foreground">
          Enter the join code provided by the team admin
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="joinCode" className="text-sm font-medium">
          Join Code <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="joinCode"
            name="joinCode"
            placeholder="Enter join code"
            value={formData.joinCode}
            onChange={handleInputChange}
            className={`pl-10 h-12 font-mono ${
              errors.joinCode ? "border-destructive" : ""
            }`}
            disabled={loading}
            required
          />
        </div>
        <AnimatePresence>
          {errors.joinCode && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-destructive"
            >
              {errors.joinCode}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setJoinMethod("choose")}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>

        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Join Team
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );

  const renderContent = () => {
    switch (joinMethod) {
      case "choose":
        return renderChooseMethod();
      case "public":
        return renderPublicForm();
      case "private":
        return renderPrivateForm();
      default:
        return renderChooseMethod();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full bg-gradient-to-br from-background to-background/50 backdrop-blur-xl border border-border/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg" />

        <div className="relative">
          <DialogHeader className="space-y-6 text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Join Team
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                {joinMethod === "choose"
                  ? "Choose how you'd like to join a team"
                  : "Enter the details to join the team"}
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <div className="mt-8">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
