import React, { useState, useCallback, useEffect } from "react";
import { Plus, UserPlus, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { TeamCard } from "../../components/teams/TeamCard";
import { CreateTeamModal } from "../../components/teams/CreateTeamModal";
import { JoinTeamModal } from "../../components/teams/JoinTeamModal";
import { getUserTeams } from "../../api/team.api";
import type { Team, TeamListResponse } from "../../types/team.types";
import { toast } from "sonner";

const DashboardTeams: React.FC = () => {
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [myTeamsPage, setMyTeamsPage] = useState(1);
  const [myTeamsTotalPages, setMyTeamsTotalPages] = useState(1);
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);
  const [joinTeamModalOpen, setJoinTeamModalOpen] = useState(false);

  // Fetch user's teams with error handling and loading state
  const fetchMyTeams = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await getUserTeams({ page, limit: 6 });
      setMyTeams(response.teams);
      setMyTeamsPage(response.page);
      setMyTeamsTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      toast.error("Failed to load your teams");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchMyTeams(1);
  }, [fetchMyTeams]);

  // Handle modal success - refresh data
  const handleModalSuccess = async () => {
    await fetchMyTeams(myTeamsPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Teams</h2>
          <p className="text-muted-foreground">Teams you're a member of</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setCreateTeamModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Team
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setJoinTeamModalOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Join Team
          </Button>
        </div>
      </div>

      {myTeams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
            <p className="text-muted-foreground mb-6">
              Join your first team to start collaborating
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setCreateTeamModalOpen(true)}>
                Create Team
              </Button>
              <Button
                variant="outline"
                onClick={() => setJoinTeamModalOpen(true)}
              >
                Join Team
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onJoin={() => {}} // Already joined
              />
            ))}
          </div>

          {myTeamsTotalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMyTeams(myTeamsPage - 1)}
                disabled={myTeamsPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {myTeamsPage} of {myTeamsTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMyTeams(myTeamsPage + 1)}
                disabled={myTeamsPage === myTeamsTotalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateTeamModal
        isOpen={createTeamModalOpen}
        onClose={() => setCreateTeamModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <JoinTeamModal
        isOpen={joinTeamModalOpen}
        onClose={() => setJoinTeamModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DashboardTeams;
