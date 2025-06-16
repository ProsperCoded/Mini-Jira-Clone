import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ResponseDto } from 'src/utils/response.dto';
import { AuthUser } from 'src/types/auth.types';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TaskResponse>> {
    const task = await this.tasksService.createTask(user.id, createTaskDto);
    return ResponseDto.created(task, 'Task created successfully');
  }

  @Get()
  async getTasks(
    @Query() query: TaskQueryDto,
    @GetUser() user: AuthUser,
  ): Promise<
    ResponseDto<{
      tasks: TaskResponse[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const result = await this.tasksService.getTasks(user.id, query);
    return ResponseDto.ok(result, 'Tasks retrieved successfully');
  }

  @Get('dashboard')
  async getDashboardStats(
    @Query() query: DashboardStatsDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<DashboardStats>> {
    const stats = await this.tasksService.getDashboardStats(user.id, query);
    return ResponseDto.ok(stats, 'Dashboard statistics retrieved successfully');
  }

  @Get('stats/:teamId')
  async getTaskStats(
    @Param('teamId') teamId: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TaskStats>> {
    const stats = await this.tasksService.getTaskStats(teamId, user.id);
    return ResponseDto.ok(stats, 'Task statistics retrieved successfully');
  }

  @Get(':id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TaskResponse>> {
    const task = await this.tasksService.getTaskById(id, user.id);
    return ResponseDto.ok(task, 'Task retrieved successfully');
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TaskResponse>> {
    const task = await this.tasksService.updateTask(id, user.id, updateTaskDto);
    return ResponseDto.ok(task, 'Task updated successfully');
  }

  @Put(':id/reorder')
  async reorderTask(
    @Param('id') id: string,
    @Body() reorderDto: Omit<ReorderTaskDto, 'taskId'>,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TaskResponse>> {
    const task = await this.tasksService.reorderTask(user.id, {
      taskId: id,
      ...reorderDto,
    });
    return ResponseDto.ok(task, 'Task reordered successfully');
  }

  @Delete(':id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<void>> {
    await this.tasksService.deleteTask(id, user.id);
    return ResponseDto.ok(undefined, 'Task deleted successfully');
  }
}
