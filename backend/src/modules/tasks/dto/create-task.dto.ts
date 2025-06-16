import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Invalid priority value' })
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status value' })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  // @IsDateString()
  dueDate?: Date;

  @IsString()
  teamId: string;
}
