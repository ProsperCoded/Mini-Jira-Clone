import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Gauge,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logo from "./ui/Logo";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Auth hooks
  const { user, isAuthenticated, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const navItems = [
    {
      name: "Features",
      href: "#features",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    { name: "Explore", href: "/explore", icon: <Users className="w-4 h-4" /> },
    {
      name: "Analytics",
      href: "#analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      name: "Pricing",
      href: "#pricing",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => {
              const isExternalLink = item.href.startsWith("#");

              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isExternalLink ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                    >
                      <span className="group-hover:text-blue-600 transition-colors">
                        {item.icon}
                      </span>
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                    >
                      <span className="group-hover:text-blue-600 transition-colors">
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </motion.div>
            </motion.button>

            {/* Authenticated User Menu */}
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <Gauge className="w-4 h-4" />
                  Dashboard
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.username} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden lg:block">
                        {user.firstName || user.username}
                      </span>
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.username} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.firstName
                              ? `${user.firstName} ${user.lastName || ""}`
                              : user.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              /* Auth Buttons - Desktop */
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={openLogin}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 flex items-center gap-2"
                  onClick={openRegister}
                >
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="pt-6 pb-4 space-y-4">
            {navItems.map((item, index) => {
              const isExternalLink = item.href.startsWith("#");

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : -20,
                  }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isExternalLink ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-blue-600">{item.icon}</span>
                      <span className="text-foreground font-medium">
                        {item.name}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-blue-600">{item.icon}</span>
                      <span className="text-foreground font-medium">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </motion.div>
              );
            })}

            <div className="pt-4 border-t border-border space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.username} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-xs">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.firstName
                          ? `${user.firstName} ${user.lastName || ""}`
                          : user.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full justify-start gap-2"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Gauge className="w-4 h-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={openLogin}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 justify-start gap-2"
                    onClick={openRegister}
                  >
                    <UserPlus className="w-4 h-4" />
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
