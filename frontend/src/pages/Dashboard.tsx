import React, { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Search,
  LogOut,
  X,
  Menu,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { JoinTeamModal } from "../components/modals/JoinTeamModal";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [joinTeamModalOpen, setJoinTeamModalOpen] = React.useState(false);

  useEffect(() => {
    console.log("user changed", user);
  }, [user]);

  // Handle logout with proper cleanup
  const handleLogout = useCallback(async () => {
    try {
      logout();
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  }, [logout, navigate]);

  // Sidebar items with their routes
  const sidebarItems = [
    {
      id: "home" as const,
      label: "Home",
      icon: Home,
      description: "Overview & Stats",
      path: "/dashboard",
    },
    {
      id: "teams" as const,
      label: "My Teams",
      icon: Users,
      description: "Teams you've joined",
      path: "/dashboard/teams",
    },
    {
      id: "explore" as const,
      label: "Explore",
      icon: Search,
      description: "Discover new teams",
      path: "/dashboard/explore",
    },
  ];

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access your dashboard
            </p>
            <Button onClick={openLogin}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-background flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`
            fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 bg-card border-r border-border
            lg:translate-x-0 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          initial={false}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-4 flex-col items-start"
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 space-y-2 border-t border-border">
              {/* Join Team Button */}
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => setJoinTeamModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-3" />
                Join Team
              </Button>

              {/* Logout Button */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-[calc(100vh-4rem)]">
          {/* Mobile Header */}
          <div className="lg:hidden bg-card border-b border-border p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Join Team Modal */}
      <JoinTeamModal
        isOpen={joinTeamModalOpen}
        onClose={() => setJoinTeamModalOpen(false)}
      />
    </>
  );
};

export default Dashboard;
