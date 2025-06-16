import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Users,
  Globe,
  Lock,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TeamCard } from "../components/teams/TeamCard";
import { getPublicTeams, joinTeam } from "../api/team.api";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { toast } from "sonner";
import type { Team, TeamListResponse } from "../types/team.types";

const Explore: React.FC = () => {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<
    "all" | "PUBLIC" | "PRIVATE"
  >("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch teams
  const fetchTeams = async (page = 1, search = "", reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }

      const params = {
        page,
        limit: 12,
        ...(search && { search }),
      };

      const response: TeamListResponse = await getPublicTeams(params);

      setTeams(response.teams);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Handle team join
  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      openLogin();
      return;
    }

    try {
      setJoinLoading(teamId);
      await joinTeam({ teamId });
      toast.success("Successfully joined the team!");

      // Refresh teams to update member count
      await fetchTeams(currentPage, debouncedSearch);
    } catch (error: any) {
      console.error("Error joining team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join team";
      toast.error(errorMessage);
    } finally {
      setJoinLoading(null);
    }
  };

  // Handle private team join with code
  const handleJoinPrivateTeam = async () => {
    if (!user) {
      openLogin();
      return;
    }

    const joinCode = prompt("Enter the team join code:");
    if (!joinCode) return;

    try {
      setJoinLoading("private");
      await joinTeam({ joinCode });
      toast.success("Successfully joined the private team!");

      // Refresh teams
      await fetchTeams(currentPage, debouncedSearch);
    } catch (error: any) {
      console.error("Error joining private team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join team";
      toast.error(errorMessage);
    } finally {
      setJoinLoading(null);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTeams(1, "", true);
  }, []);

  // Handle search
  useEffect(() => {
    if (currentPage === 1) {
      fetchTeams(1, debouncedSearch);
    } else {
      setCurrentPage(1);
      fetchTeams(1, debouncedSearch);
    }
  }, [debouncedSearch]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTeams(page, debouncedSearch);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            className="text-center space-y-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discover Teams
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Find and join amazing teams working on exciting projects.
              Collaborate, learn, and build together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {total} teams available
              </Badge>
              <Button
                onClick={handleJoinPrivateTeam}
                variant="outline"
                className="flex items-center gap-2"
                disabled={joinLoading === "private"}
              >
                {joinLoading === "private" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Join Private Team
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search teams by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as "all" | "PUBLIC" | "PRIVATE")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Team Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="PUBLIC">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="PRIVATE">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Private
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchTeams(currentPage, debouncedSearch)}
                disabled={loading || searchLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading || searchLoading ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Teams Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading teams...</p>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <motion.div
            className="text-center py-16 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No teams found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery
                ? `No teams match your search "${searchQuery}". Try different keywords.`
                : "No teams are available at the moment. Check back later!"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {teams.map((team) => (
              <motion.div key={team.id} variants={itemVariants}>
                <TeamCard
                  team={team}
                  onJoin={handleJoinTeam}
                  className={
                    joinLoading === team.id
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-2 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPaginationNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    disabled={loading}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Explore;
