import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  Globe,
  Lock,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { TeamCard } from "../../components/teams/TeamCard";
import { getPublicTeams, joinTeam } from "../../api/team.api";
import type { Team, TeamListResponse } from "../../types/team.types";
import { toast } from "sonner";

const DashboardExplore: React.FC = () => {
  const [exploreTeams, setExploreTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [exploreTeamsPage, setExploreTeamsPage] = useState(1);
  const [exploreTeamsTotalPages, setExploreTeamsTotalPages] = useState(1);
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

  // Fetch explore teams with error handling and loading state
  const fetchExploreTeams = useCallback(
    async (page = 1, search = "", reset = false) => {
      try {
        if (reset) {
          setLoading(true);
        } else {
          setSearchLoading(true);
        }

        const params = {
          page,
          limit: 6,
          ...(search && { search }),
        };

        const response: TeamListResponse = await getPublicTeams(params);
        setExploreTeams(response.teams);
        setExploreTeamsPage(response.page);
        setExploreTeamsTotalPages(response.totalPages);
        setTotal(response.total);
      } catch (error) {
        console.error("Error fetching explore teams:", error);
        toast.error("Failed to load teams");
      } finally {
        setLoading(false);
        setSearchLoading(false);
      }
    },
    []
  );

  // Load initial data
  useEffect(() => {
    fetchExploreTeams(1, "", true);
  }, [fetchExploreTeams]);

  // Handle search
  useEffect(() => {
    if (exploreTeamsPage === 1) {
      fetchExploreTeams(1, debouncedSearch);
    } else {
      setExploreTeamsPage(1);
      fetchExploreTeams(1, debouncedSearch);
    }
  }, [debouncedSearch, fetchExploreTeams]);

  // Handle team join
  const handleJoinTeam = async (teamId: string) => {
    try {
      await joinTeam({ teamId });
      toast.success("Successfully joined the team!");
      await fetchExploreTeams(exploreTeamsPage, debouncedSearch);
    } catch (error: any) {
      console.error("Error joining team:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to join team";
      toast.error(errorMessage);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setExploreTeamsPage(page);
    fetchExploreTeams(page, debouncedSearch);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-2">Explore Teams</h2>
        <p className="text-muted-foreground mb-4">
          Discover and join new teams
        </p>

        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {total} teams available
          </Badge>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="bg-card/50 backdrop-blur-sm border rounded-xl p-6"
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
              onClick={() =>
                fetchExploreTeams(exploreTeamsPage, debouncedSearch)
              }
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
      {exploreTeams.length === 0 ? (
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          {exploreTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TeamCard team={team} onJoin={handleJoinTeam} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {exploreTeamsTotalPages > 1 && (
        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(exploreTeamsPage - 1)}
            disabled={exploreTeamsPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {exploreTeamsPage} of {exploreTeamsTotalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(exploreTeamsPage + 1)}
            disabled={exploreTeamsPage === exploreTeamsTotalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardExplore;
