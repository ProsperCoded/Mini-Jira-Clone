import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../utils/prisma.service';
import { nanoid } from 'nanoid';
import {
  CreateTeamDto,
  UpdateTeamDto,
  JoinTeamDto,
  InviteUserDto,
  TeamQueryDto,
} from './dto';
import {
  TeamResponse,
  TeamMemberResponse,
  TeamStats,
} from '../../types/team.types';

import { TeamType, UserRole, User } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  private mapUserToOwner(user: {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
  }) {
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    };
  }

  private mapTeamToResponse(team: any): TeamResponse {
    return {
      id: team.id,
      name: team.name,
      description: team.description || undefined,
      type: team.type,
      joinCode: team.joinCode || undefined,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      ownerId: team.ownerId,
      owner: this.mapUserToOwner(team.owner),
      memberCount: team._count.members,
      taskCount: team._count.tasks,
    };
  }

  private mapTeamMemberToResponse(member: any): TeamMemberResponse {
    return {
      id: member.id,
      role: member.role,
      joinedAt: member.joinedAt,
      user: {
        id: member.user.id,
        username: member.user.username,
        email: member.user.email,
        firstName: member.user.firstName || undefined,
        lastName: member.user.lastName || undefined,
      },
    };
  }

  async createTeam(
    userId: string,
    createTeamDto: CreateTeamDto,
  ): Promise<TeamResponse> {
    const joinCode =
      createTeamDto.type === TeamType.PRIVATE ? nanoid(10) : null;

    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        description: createTeamDto.description,
        type: createTeamDto.type,
        joinCode,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: UserRole.ADMIN,
          },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    });

    return this.mapTeamToResponse(team);
  }

  async getPublicTeams(queryDto: TeamQueryDto): Promise<{
    teams: TeamResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { search, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const where = {
      type: TeamType.PUBLIC,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [teams, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              members: true,
              tasks: true,
            },
          },
        },
      }),
      this.prisma.team.count({ where }),
    ]);

    return {
      teams: teams.map(this.mapTeamToResponse.bind(this)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserTeams(
    userId: string,
    queryDto: TeamQueryDto,
  ): Promise<{
    teams: TeamResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { search, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    const where = {
      members: {
        some: {
          userId,
        },
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [teams, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              members: true,
              tasks: true,
            },
          },
        },
      }),
      this.prisma.team.count({ where }),
    ]);

    return {
      teams: teams.map(this.mapTeamToResponse.bind(this)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTeamById(teamId: string, userId: string): Promise<TeamResponse> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        members: {
          where: { userId },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Check if user is a member or if team is public
    if (team.type === TeamType.PRIVATE && team.members.length === 0) {
      throw new ForbiddenException('You do not have access to this team');
    }

    return this.mapTeamToResponse(team);
  }

  async joinTeam(
    userId: string,
    joinTeamDto: JoinTeamDto,
  ): Promise<TeamMemberResponse> {
    const { teamId, joinCode } = joinTeamDto;

    if (!teamId && !joinCode) {
      throw new BadRequestException(
        'Either teamId or joinCode must be provided',
      );
    }

    let team;

    if (joinCode) {
      // Join private team with join code
      team = await this.prisma.team.findUnique({
        where: { joinCode },
        include: {
          members: {
            where: { userId },
          },
        },
      });

      if (!team) {
        throw new NotFoundException('Invalid join code');
      }
    } else {
      // Join public team with teamId
      team = await this.prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: {
            where: { userId },
          },
        },
      });

      if (!team) {
        throw new NotFoundException('Team not found');
      }

      if (team.type === TeamType.PRIVATE) {
        throw new ForbiddenException(
          'Cannot join private team without join code',
        );
      }
    }

    // Check if user is already a member
    if (team.members.length > 0) {
      throw new ConflictException('You are already a member of this team');
    }

    const teamMember = await this.prisma.teamMember.create({
      data: {
        userId,
        teamId: team.id,
        role: UserRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.mapTeamMemberToResponse(teamMember);
  }

  async leaveTeam(userId: string, teamId: string): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.members.length === 0) {
      throw new NotFoundException('You are not a member of this team');
    }

    if (team.ownerId === userId) {
      throw new ForbiddenException(
        'Team owner cannot leave the team. Transfer ownership or delete the team instead.',
      );
    }

    await this.prisma.teamMember.deleteMany({
      where: {
        userId,
        teamId,
      },
    });
  }

  async updateTeam(
    userId: string,
    teamId: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamResponse> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can update team settings');
    }

    // Generate new join code if type is changing to private or if already private
    let joinCode = team.joinCode;
    if (
      updateTeamDto.type === TeamType.PRIVATE ||
      (updateTeamDto.type === undefined && team.type === TeamType.PRIVATE)
    ) {
      joinCode = nanoid(10);
    } else if (updateTeamDto.type === TeamType.PUBLIC) {
      joinCode = null;
    }

    const updatedTeam = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        ...updateTeamDto,
        joinCode,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    });

    return this.mapTeamToResponse(updatedTeam);
  }

  async regenerateJoinCode(
    userId: string,
    teamId: string,
  ): Promise<{ joinCode: string }> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can regenerate join code');
    }

    if (team.type !== TeamType.PRIVATE) {
      throw new BadRequestException(
        'Join code can only be regenerated for private teams',
      );
    }

    const newJoinCode = nanoid(10);

    await this.prisma.team.update({
      where: { id: teamId },
      data: { joinCode: newJoinCode },
    });

    return { joinCode: newJoinCode };
  }

  async getTeamMembers(
    teamId: string,
    userId: string,
  ): Promise<TeamMemberResponse[]> {
    // Check if user is a member of the team
    const userMembership = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!userMembership) {
      throw new ForbiddenException(
        'You must be a team member to view member list',
      );
    }

    const members = await this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // ADMIN first
        { joinedAt: 'asc' },
      ],
    });

    return members.map(this.mapTeamMemberToResponse.bind(this));
  }

  async inviteUser(
    userId: string,
    teamId: string,
    inviteUserDto: InviteUserDto,
  ): Promise<TeamMemberResponse> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId },
          select: {
            role: true,
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.members.length === 0) {
      throw new ForbiddenException('You must be a team member to invite users');
    }

    const userMember = team.members[0];
    if (userMember.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only team admins can invite users');
    }

    // Find user by username
    const targetUser = await this.prisma.user.findUnique({
      where: { username: inviteUserDto.username },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: targetUser.id,
          teamId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this team');
    }

    const teamMember = await this.prisma.teamMember.create({
      data: {
        userId: targetUser.id,
        teamId,
        role: inviteUserDto.role || UserRole.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.mapTeamMemberToResponse(teamMember);
  }

  async removeUser(
    userId: string,
    teamId: string,
    targetUserId: string,
  ): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.members.length === 0) {
      throw new ForbiddenException('You must be a team member to remove users');
    }

    const userMember = team.members[0];
    if (userMember.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only team admins can remove users');
    }

    if (team.ownerId === targetUserId) {
      throw new ForbiddenException('Cannot remove team owner');
    }

    const targetMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: targetUserId,
          teamId,
        },
      },
    });

    if (!targetMember) {
      throw new NotFoundException('User is not a member of this team');
    }

    await this.prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId: targetUserId,
          teamId,
        },
      },
    });
  }

  async deleteTeam(userId: string, teamId: string): Promise<void> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only team owner can delete the team');
    }

    await this.prisma.team.delete({
      where: { id: teamId },
    });
  }

  async getTeamStats(teamId: string, userId: string): Promise<TeamStats> {
    // Check if user is a member of the team
    const userMembership = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!userMembership) {
      throw new ForbiddenException(
        'You must be a team member to view team stats',
      );
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [memberCount, taskCounts, recentActivity] = await Promise.all([
      this.prisma.teamMember.count({
        where: { teamId },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        where: { teamId },
        _count: { status: true },
      }),
      this.prisma.task.count({
        where: {
          teamId,
          OR: [
            { createdAt: { gte: sevenDaysAgo } },
            { updatedAt: { gte: sevenDaysAgo } },
          ],
        },
      }),
    ]);

    const tasksByStatus = {
      todo: 0,
      inProgress: 0,
      done: 0,
    };

    taskCounts.forEach((count) => {
      switch (count.status) {
        case 'TODO':
          tasksByStatus.todo = count._count.status;
          break;
        case 'IN_PROGRESS':
          tasksByStatus.inProgress = count._count.status;
          break;
        case 'DONE':
          tasksByStatus.done = count._count.status;
          break;
      }
    });

    return {
      totalMembers: memberCount,
      totalTasks:
        tasksByStatus.todo + tasksByStatus.inProgress + tasksByStatus.done,
      tasksByStatus,
      recentActivity,
    };
  }

  async getUserTeamIds(userId: string): Promise<string[]> {
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    });

    return teamMembers.map((member) => member.teamId);
  }
}
