import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckSquare,
  Plus,
  Lock,
  Globe,
  Calendar,
  Crown,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { type Team } from "../../types/team.types";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { useUserTeams } from "../../hooks/useUserTeams";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
  team: Team;
  onJoin?: (teamId: string) => void;
  className?: string;
}

const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onJoin,
  className,
}) => {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const { isUserInTeam } = useUserTeams();
  const navigate = useNavigate();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Check if current user is the team owner
  const isOwner = user?.id === team.ownerId;
  // Check if current user is already a member
  const isAlreadyMember = Boolean(user && isUserInTeam(team.id));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotationX = (y - centerY) / 15;
      const rotationY = -(x - centerX) / 15;

      setRotation({ x: rotationX, y: rotationY });
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleJoinClick = () => {
    if (!user) {
      openLogin();
      return;
    }
    if (onJoin) {
      onJoin(team.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if clicking on the join button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    navigate(`/team/${team.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        onClick={handleCardClick}
        className={cn(
          "relative w-full max-w-sm mx-auto overflow-hidden rounded-2xl",
          "bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-border/50",
          "shadow-xl transition-all duration-500 ease-out",
          "hover:shadow-glow-team-card",
          "transform-gpu will-change-transform cursor-pointer hover-glow-blue-green",
          className
        )}
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${
            rotation.y
          }deg) scale(${isHovered ? 1.02 : 1})`,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500",
            "bg-gradient-to-r from-blue-500/20 via-blue-400/25 to-green-500/20",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Glass overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-white/20 to-white/5",
            "dark:from-white/10 dark:to-white/2",
            "backdrop-blur-sm transition-opacity duration-300",
            isHovered ? "opacity-80" : "opacity-0"
          )}
        />

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Header with team type badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge
                variant={team.type === "PUBLIC" ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                {team.type === "PUBLIC" ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {team.type}
              </Badge>

              {/* Admin badge */}
              {isOwner && (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
                >
                  <Crown className="w-3 h-3" />
                  ADMIN
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar className="w-3 h-3" />
              {formatDate(team.createdAt)}
            </div>
          </div>

          {/* Team Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground leading-tight mb-2">
                {team.name}
              </h3>

              {team.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {team.description}
                </p>
              )}
            </div>

            {/* Owner info */}
            <div className="text-xs text-muted-foreground">
              Created by{" "}
              <span className="font-medium text-foreground">
                {team.owner.firstName || team.owner.username}
                {team.owner.lastName && ` ${team.owner.lastName}`}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between py-3 border-t border-border/50">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {team.memberCount} members
                </span>
              </div>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <CheckSquare className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {team.taskCount} tasks
                </span>
              </div>
            </div>

            {/* Join Button */}
            <Button
              onClick={handleJoinClick}
              disabled={isAlreadyMember}
              className={cn(
                "w-full group relative overflow-hidden",
                isAlreadyMember
                  ? "bg-gradient-to-r from-green-500/10 to-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30"
                  : "bg-gradient-to-r from-blue-500/10 to-green-500/10 hover:from-blue-500/20 hover:to-green-500/20 text-foreground border border-blue-500/30 hover:border-green-500/30",
                "transition-all duration-300",
                !isAlreadyMember ? "hover:scale-105" : "",
                "backdrop-blur-sm",
                !isAlreadyMember ? "hover:shadow-glow-blue-green" : ""
              )}
              variant="outline"
            >
              <span className="flex items-center justify-center space-x-2 relative z-10">
                {isAlreadyMember ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
                    <span>{user ? "Join Team" : "Login to Join"}</span>
                  </>
                )}
              </span>

              {/* Button glow effect */}
              {!isAlreadyMember && (
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-green-500/20",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  )}
                />
              )}
            </Button>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full",
                "animate-pulse transition-opacity duration-1000",
                i % 2 === 0 ? "bg-blue-500/40" : "bg-green-500/40",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              style={{
                left: `${15 + i * 20}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
