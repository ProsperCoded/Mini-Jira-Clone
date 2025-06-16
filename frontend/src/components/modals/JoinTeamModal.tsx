import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Key,
  ArrowRight,
  Loader2,
  Users,
  ExternalLink,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent } from "../ui/card";
import { joinTeam } from "../../api/team.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [showJoinCodeInput, setShowJoinCodeInput] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleFindTeam = () => {
    onClose();
    navigate("/dashboard/explore");
  };

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a valid join code");
      return;
    }

    try {
      setIsJoining(true);
      await joinTeam({ joinCode: joinCode.trim() });
      toast.success("Successfully joined the team!");
      onClose();
      setJoinCode("");
      setShowJoinCodeInput(false);

      // Optionally refresh the user's teams or navigate to teams page
      navigate("/dashboard/teams");
    } catch (error: any) {
      console.error("Error joining team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join team";
      toast.error(errorMessage);
    } finally {
      setIsJoining(false);
    }
  };

  const handleReset = () => {
    setShowJoinCodeInput(false);
    setJoinCode("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Join a Team
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!showJoinCodeInput ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground">
                  Choose how you'd like to join a team:
                </p>

                {/* Find Team Option */}
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={handleFindTeam}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Search className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Find Team</h3>
                          <p className="text-sm text-muted-foreground">
                            Browse and discover public teams
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Join by Code Option */}
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setShowJoinCodeInput(true)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Key className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Join by Code</h3>
                          <p className="text-sm text-muted-foreground">
                            Enter a private team invitation code
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="join-code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="p-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </Button>
                  <h3 className="font-medium">Enter Join Code</h3>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Enter team join code..."
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="pl-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isJoining) {
                          handleJoinByCode();
                        }
                      }}
                      disabled={isJoining}
                      autoFocus
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Join codes are provided by team administrators for private
                    teams.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isJoining}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleJoinByCode}
                    disabled={!joinCode.trim() || isJoining}
                    className="flex-1"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Join Team
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
