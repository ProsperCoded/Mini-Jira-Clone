import React from "react";
import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { Badge } from "./badge";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showBadge = true,
  className = "",
}) => {
  const getSizes = () => {
    switch (size) {
      case "sm":
        return {
          container: "gap-2",
          icon: "w-6 h-6",
          iconContainer: "w-6 h-6",
          title: "text-sm",
          badge: "text-xs",
          pulse: "w-2 h-2",
          pulsePosition: "-top-0.5 -right-0.5",
        };
      case "lg":
        return {
          container: "gap-4",
          icon: "w-8 h-8",
          iconContainer: "w-12 h-12",
          title: "text-2xl",
          badge: "text-sm",
          pulse: "w-5 h-5",
          pulsePosition: "-top-1 -right-1",
        };
      default: // md
        return {
          container: "gap-3",
          icon: "w-6 h-6",
          iconContainer: "w-10 h-10",
          title: "text-xl",
          badge: "text-xs",
          pulse: "w-4 h-4",
          pulsePosition: "-top-1 -right-1",
        };
    }
  };

  const sizes = getSizes();

  return (
    <Link to="/" className="block">
      <motion.div
        className={`flex items-center ${sizes.container} ${className}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <div
            className={`${sizes.iconContainer} bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center`}
          >
            <CheckSquare className={`${sizes.icon} text-white`} />
          </div>
          <motion.div
            className={`absolute ${sizes.pulsePosition} ${sizes.pulse} bg-green-500 rounded-full`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <h1 className={`${sizes.title} font-bold text-foreground`}>
            Mini Jira
          </h1>
          {showBadge && (
            <Badge variant="secondary" className={sizes.badge}>
              Beta
            </Badge>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default Logo;
