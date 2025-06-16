import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class TaskQueryDto {
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  @Transform(({ value }) => (value ? parseInt(value) : 1))
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  @Transform(({ value }) => (value ? parseInt(value) : 20))
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status value' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Invalid priority value' })
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  creatorId?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'title', 'priority', 'dueDate', 'order'], {
    message: 'Invalid sort field',
  })
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'title'
    | 'priority'
    | 'dueDate'
    | 'order' = 'order';

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Sort order must be asc or desc' })
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsDateString({}, { message: 'Due from date must be a valid date' })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dueFrom?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'Due to date must be a valid date' })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dueTo?: Date;
}
