import { useState, useEffect, useCallback } from "react";
import { getUserTeamIds } from "../api/team.api";
import { useAuth } from "../contexts/AuthContext";

export const useUserTeams = () => {
  const { user } = useAuth();
  const [userTeamIds, setUserTeamIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTeams = useCallback(async () => {
    if (!user) {
      setUserTeamIds([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const teamIds = await getUserTeamIds();
      setUserTeamIds(teamIds);
    } catch (err: any) {
      console.error("Failed to fetch user teams:", err);
      setError(err.message || "Failed to fetch user teams");
      setUserTeamIds([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserTeams();
  }, [fetchUserTeams]);

  const isUserInTeam = useCallback(
    (teamId: string) => {
      return userTeamIds.includes(teamId);
    },
    [userTeamIds]
  );

  const refreshUserTeams = useCallback(() => {
    fetchUserTeams();
  }, [fetchUserTeams]);

  return {
    userTeamIds,
    isLoading,
    error,
    isUserInTeam,
    refreshUserTeams,
  };
};
