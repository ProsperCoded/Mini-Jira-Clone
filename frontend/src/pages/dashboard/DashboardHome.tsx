import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle,
  Users,
  Clock,
  Search,
  Loader2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { TaskCard } from "../../components/tasks/TaskCard";
import { TeamCard } from "../../components/teams/TeamCard";
import { useAuth } from "../../contexts/AuthContext";
import {
  taskApi,
  type DashboardStats,
  type Task,
  type TaskQueryParams,
} from "../../api/task.api";
import { getPublicTeams, joinTeam } from "../../api/team.api";
import type { Team } from "../../types/team.types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [popularTeams, setPopularTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await taskApi.getDashboardStats({ importantTasksLimit: 5 });
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch popular teams for users with no teams
  const fetchPopularTeams = useCallback(async () => {
    try {
      const response = await getPublicTeams({ limit: 10, page: 1 });
      setPopularTeams(response.teams);
    } catch (error) {
      console.error("Error fetching popular teams:", error);
    }
  }, []);

  // Search tasks
  const searchTasks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const params: TaskQueryParams = {
        search: query,
        limit: 10,
        sortBy: "priority",
        sortOrder: "desc",
      };

      const result = await taskApi.getAll(params);
      setSearchResults(result.tasks);
    } catch (error) {
      console.error("Error searching tasks:", error);
      toast.error("Failed to search tasks");
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Handle team join
  const handleJoinTeam = async (teamId: string) => {
    try {
      setJoiningTeamId(teamId);
      await joinTeam({ teamId });
      toast.success("Successfully joined the team!");

      // Refresh dashboard stats and popular teams
      await Promise.all([fetchDashboardStats(), fetchPopularTeams()]);
    } catch (error: any) {
      console.error("Error joining team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join team";
      toast.error(errorMessage);
    } finally {
      setJoiningTeamId(null);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchTasks(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchTasks]);

  // Initial load
  useEffect(() => {
    fetchDashboardStats();
    fetchPopularTeams();
  }, [fetchDashboardStats, fetchPopularTeams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const hasNoTeams = dashboardStats?.activeTeams === 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || user?.username}! 👋
        </h2>
        <p className="text-muted-foreground">
          {hasNoTeams
            ? "Let's get you started by joining a team!"
            : "Here's what's happening with your teams today."}
        </p>
      </motion.div>

      {hasNoTeams ? (
        /* No Teams State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">
                Join Your First Team
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Teams are where the magic happens! Join a team to start
                collaborating, managing tasks, and achieving goals together.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/dashboard/explore")}>
                  <Search className="w-4 h-4 mr-2" />
                  Explore Teams
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/teams")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Popular Teams */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Popular Teams
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularTeams.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* <TeamCard
                    team={team}
                    onJoin={handleJoinTeam}
                    className={
                      joiningTeamId === team.id
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  /> */}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        /* Dashboard with Teams */
        <div className="space-y-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardStats?.completedTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Out of {dashboardStats?.totalTasks || 0} total tasks
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Teams
                </CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardStats?.activeTeams || 0}
                </div>
                <p className="text-xs text-muted-foreground">Teams joined</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardStats?.totalTasks || 0}
                </div>
                <p className="text-xs text-muted-foreground">Assigned to you</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Task Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search your tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Found {searchResults.length} task(s)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Important Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Important Tasks
                    <Badge variant="outline">
                      {dashboardStats?.importantTasks?.length || 0}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/dashboard/teams")}
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardStats?.importantTasks &&
                dashboardStats.importantTasks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardStats.importantTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                      // <div key={task.id}>{task.title}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending important tasks!</p>
                    <p className="text-sm">
                      Great job staying on top of things 🎉
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
