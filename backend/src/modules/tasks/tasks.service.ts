import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../utils/prisma.service';
import { TaskPriority, TaskStatus, UserRole } from '@prisma/client';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  ReorderTaskDto,
  DashboardStatsDto,
} from './dto';
import {
  TaskResponse,
  TaskStats,
  DashboardStats,
} from '../../types/task.types';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    userId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskResponse> {
    // Verify user is a member of the team
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: createTaskDto.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    // If assignee is specified, verify they are a team member
    if (createTaskDto.assigneeId) {
      const assigneeMember = await this.prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: createTaskDto.assigneeId,
            teamId: createTaskDto.teamId,
          },
        },
      });

      if (!assigneeMember) {
        throw new BadRequestException('Assignee is not a member of this team');
      }
    }

    // Get the next order number for the status
    const maxOrder = await this.prisma.task.aggregate({
      where: {
        teamId: createTaskDto.teamId,
        status: createTaskDto.status || TaskStatus.TODO,
      },
      _max: {
        order: true,
      },
    });

    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        creatorId: userId,
        order: (maxOrder._max.order || 0) + 1,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return task as TaskResponse;
  }

  async getTasks(
    userId: string,
    query: TaskQueryDto,
  ): Promise<{
    tasks: TaskResponse[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = 'order',
      sortOrder = 'asc',
    } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // If teamId is provided, verify user is a member
    if (query.teamId) {
      const teamMember = await this.prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId,
            teamId: query.teamId,
          },
        },
      });

      if (!teamMember) {
        throw new ForbiddenException('You are not a member of this team');
      }

      where.teamId = query.teamId;
    } else {
      // Get all teams user is a member of
      const userTeams = await this.prisma.teamMember.findMany({
        where: { userId },
        select: { teamId: true },
      });

      if (userTeams.length === 0) {
        return {
          tasks: [],
          total: 0,
          page,
          totalPages: 0,
        };
      }

      where.teamId = {
        in: userTeams.map((t) => t.teamId),
      };
    }

    // Add filters
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.assigneeId) where.assigneeId = query.assigneeId;
    if (query.creatorId) where.creatorId = query.creatorId;

    // Date range filter
    if (query.dueFrom || query.dueTo) {
      where.dueDate = {};
      if (query.dueFrom) where.dueDate.gte = query.dueFrom;
      if (query.dueTo) where.dueDate.lte = query.dueTo;
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build order clause
    const orderBy: any = {};
    if (sortBy === 'priority') {
      orderBy.priority = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          assignee: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      tasks: tasks as TaskResponse[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(taskId: string, userId: string): Promise<TaskResponse> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user is a member of the team
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: task.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    return task as TaskResponse;
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { team: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user permission (creator, assignee, or team admin)
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: task.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    const canEdit =
      task.creatorId === userId ||
      task.assigneeId === userId ||
      teamMember.role === UserRole.ADMIN;

    if (!canEdit) {
      throw new ForbiddenException(
        'You do not have permission to edit this task',
      );
    }

    // If assignee is being changed, verify they are a team member
    if (updateTaskDto.assigneeId) {
      const assigneeMember = await this.prisma.teamMember.findUnique({
        where: {
          userId_teamId: {
            userId: updateTaskDto.assigneeId,
            teamId: task.teamId,
          },
        },
      });

      if (!assigneeMember) {
        throw new BadRequestException('Assignee is not a member of this team');
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: updateTaskDto,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedTask as TaskResponse;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user permission (creator or team admin)
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: task.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    const canDelete =
      task.creatorId === userId || teamMember.role === UserRole.ADMIN;

    if (!canDelete) {
      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }

    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async reorderTask(
    userId: string,
    reorderDto: ReorderTaskDto,
  ): Promise<TaskResponse> {
    const { taskId, newOrder, newStatus } = reorderDto;

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify user permission
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId: task.teamId,
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    const canReorder =
      task.creatorId === userId ||
      task.assigneeId === userId ||
      teamMember.role === UserRole.ADMIN;

    if (!canReorder) {
      throw new ForbiddenException(
        'You do not have permission to reorder this task',
      );
    }

    // Update task order and status
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        order: newOrder,
        ...(newStatus && { status: newStatus }),
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedTask as TaskResponse;
  }

  async getTaskStats(teamId: string, userId: string): Promise<TaskStats> {
    // Verify user is a member of the team
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!teamMember) {
      throw new ForbiddenException('You are not a member of this team');
    }

    const [total, todo, inProgress, done, overdue, highPriority, myTasks] =
      await Promise.all([
        this.prisma.task.count({ where: { teamId } }),
        this.prisma.task.count({ where: { teamId, status: TaskStatus.TODO } }),
        this.prisma.task.count({
          where: { teamId, status: TaskStatus.IN_PROGRESS },
        }),
        this.prisma.task.count({ where: { teamId, status: TaskStatus.DONE } }),
        this.prisma.task.count({
          where: {
            teamId,
            dueDate: { lt: new Date() },
            status: { not: TaskStatus.DONE },
          },
        }),
        this.prisma.task.count({
          where: { teamId, priority: TaskPriority.HIGH },
        }),
        this.prisma.task.count({
          where: {
            teamId,
            OR: [{ creatorId: userId }, { assigneeId: userId }],
          },
        }),
      ]);

    return {
      total,
      todo,
      inProgress,
      done,
      overdue,
      highPriority,
      myTasks,
    };
  }

  async getDashboardStats(
    userId: string,
    query: DashboardStatsDto,
  ): Promise<DashboardStats> {
    // Get all teams user is a member of
    const userTeams = await this.prisma.teamMember.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const teamIds = userTeams.map((t) => t.teamId);

    if (teamIds.length === 0) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        activeTeams: 0,
        importantTasks: [],
      };
    }

    // Get total tasks assigned to user
    const totalTasks = await this.prisma.task.count({
      where: {
        assigneeId: userId,
        teamId: { in: teamIds },
      },
    });

    // Get completed tasks count
    const completedTasks = await this.prisma.task.count({
      where: {
        assigneeId: userId,
        teamId: { in: teamIds },
        status: TaskStatus.DONE,
      },
    });

    // Get active teams count
    const activeTeams = teamIds.length;

    // Get important tasks (high priority, TODO/IN_PROGRESS, sorted by priority and order)
    const importantTasks = await this.prisma.task.findMany({
      where: {
        assigneeId: userId,
        teamId: { in: teamIds },
        status: {
          in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS],
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' }, // HIGH priority first
        { order: 'asc' }, // Then by order
      ],
      take: query.importantTasksLimit || 5,
    });

    return {
      totalTasks,
      completedTasks,
      activeTeams,
      importantTasks: importantTasks as TaskResponse[],
    };
  }
}
