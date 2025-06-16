import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TaskBoard } from "../components/tasks/TaskBoard";
import { TaskModal } from "../components/tasks/TaskModal";
import { BorderBeam } from "../components/ui/border-beam";
import { MagicCard } from "../components/ui/magic-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import {
  Users,
  Settings,
  ChevronRight,
  ChevronDown,
  UserPlus,
  Filter,
  Calendar,
  BarChart3,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
} from "lucide-react";
import { getTeam, getTeamMembers } from "../api/team.api";
import type { Team, TeamMember } from "../types/team.types";
import type { Task, TaskModalMode } from "../types/task.types";
import { cn } from "../lib/utils";

export function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const userFilter = searchParams.get("user");

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Task modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [membersExpanded, setMembersExpanded] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [statsExpanded, setStatsExpanded] = useState(false);

  // Search and filter state
  const [memberSearch, setMemberSearch] = useState("");

  useEffect(() => {
    if (teamId) {
      loadTeam();
    }
  }, [teamId]);

  const loadTeam = async () => {
    if (!teamId) return;

    setLoading(true);
    setError(null);

    try {
      const teamData = await getTeam(teamId);
      const teamMembers = await getTeamMembers(teamId);
      setTeam(teamData);
      setMembers(teamMembers);
    } catch (err: any) {
      setError(err.message || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalMode("create");
    setTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskModalMode("view");
    setTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleMemberFilter = (userId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (userFilter === userId) {
      current.delete("user");
    } else {
      current.set("user", userId);
    }
    setSearchParams(current);
  };

  const clearFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("user");
    setSearchParams(current);
  };

  const filteredMembers = members.filter((member) =>
    memberSearch
      ? member.user.username
          .toLowerCase()
          .includes(memberSearch.toLowerCase()) ||
        member.user.firstName
          ?.toLowerCase()
          .includes(memberSearch.toLowerCase())
      : true
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p>Error: {error || "Team not found"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <div
          className={cn(
            "border-r bg-card transition-all duration-300 flex flex-col",
            sidebarCollapsed ? "w-16" : "w-80"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">{team.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      Team Dashboard
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    sidebarCollapsed ? "" : "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {!sidebarCollapsed && (
                <>
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleCreateTask}
                      className="w-full justify-start gap-2 relative overflow-hidden group"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                      Create Task
                      <BorderBeam
                        size={40}
                        duration={12}
                        colorFrom="#10b981"
                        colorTo="#059669"
                        className="opacity-0 group-hover:opacity-30 transition-opacity"
                      />
                    </Button>
                  </div>

                  <Separator />

                  {/* Team Members */}
                  <Collapsible
                    open={membersExpanded}
                    onOpenChange={setMembersExpanded}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Members ({members.length})
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            membersExpanded && "rotate-180"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2">
                      {/* Member Search */}
                      <div className="px-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input
                            placeholder="Search members..."
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            className="pl-7 h-8 text-xs"
                          />
                        </div>
                      </div>

                      {/* Member List */}
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {filteredMembers.map((member) => (
                          <Button
                            key={member.id}
                            variant={
                              userFilter === member.user.id
                                ? "secondary"
                                : "ghost"
                            }
                            onClick={() => handleMemberFilter(member.user.id)}
                            className="w-full justify-start gap-2 h-auto p-2 relative group"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.user.username}`}
                              />
                              <AvatarFallback className="text-xs">
                                {member.user.firstName?.[0] ||
                                  member.user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-xs font-medium truncate">
                                {member.user.firstName || member.user.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {member.role}
                              </p>
                            </div>
                            {userFilter === member.user.id && (
                              <BorderBeam
                                size={30}
                                duration={8}
                                colorFrom="#10b981"
                                colorTo="#059669"
                                className="opacity-20"
                              />
                            )}
                          </Button>
                        ))}
                      </div>

                      {userFilter && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="w-full"
                        >
                          Clear Filter
                        </Button>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Quick Filters */}
                  <Collapsible
                    open={filtersExpanded}
                    onOpenChange={setFiltersExpanded}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto"
                      >
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Quick Filters
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            filtersExpanded && "rotate-180"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <Clock className="h-4 w-4 text-blue-500" />
                        In Progress
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        High Priority
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <Calendar className="h-4 w-4 text-red-500" />
                        Due Soon
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                      >
                        <User className="h-4 w-4 text-green-500" />
                        My Tasks
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>

                  <Separator />

                  {/* Stats */}
                  <Collapsible
                    open={statsExpanded}
                    onOpenChange={setStatsExpanded}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 h-auto"
                      >
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Team Stats
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            statsExpanded && "rotate-180"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 p-2">
                      <MagicCard className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">
                          Team Progress
                        </div>
                        <div className="text-lg font-bold">75%</div>
                        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-1.5 rounded-full"
                            style={{ width: "75%" }}
                          />
                        </div>
                        <BorderBeam
                          size={50}
                          duration={15}
                          colorFrom="#10b981"
                          colorTo="#059669"
                          className="opacity-10"
                        />
                      </MagicCard>
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}

              {sidebarCollapsed && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCreateTask}
                    className="w-full h-10 relative group"
                  >
                    <Plus className="h-4 w-4" />
                    <BorderBeam
                      size={40}
                      duration={12}
                      colorFrom="#10b981"
                      colorTo="#059669"
                      className="opacity-0 group-hover:opacity-20 transition-opacity"
                    />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Team Header */}
          <MagicCard className="m-6 mb-4 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{team.name}</h1>
                    {team.description && (
                      <p className="text-muted-foreground">
                        {team.description}
                      </p>
                    )}
                  </div>
                </div>

                <Badge
                  variant={team.type === "PUBLIC" ? "default" : "secondary"}
                >
                  {team.type === "PUBLIC" ? "Public" : "Private"}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <BorderBeam
              size={200}
              duration={25}
              colorFrom="#10b981"
              colorTo="#059669"
              className="opacity-20"
            />
          </MagicCard>

          {/* Task Board */}
          <div className="flex-1 px-6 pb-6 min-h-0">
            <TaskBoard
              teamId={teamId!}
              onCreateTask={handleCreateTask}
              onTaskClick={handleTaskClick}
            />
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={handleTaskModalClose}
        mode={taskModalMode}
        task={selectedTask}
        teamId={teamId!}
        teamMembers={
          members.map((m) => ({
            id: m.user.id,
            username: m.user.username,
            firstName: m.user.firstName,
          })) || []
        }
      />
    </div>
  );
}
