import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title?: string;

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
  @IsInt({ message: 'Order must be an integer' })
  @Min(0, { message: 'Order must be non-negative' })
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  order?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date' })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  dueDate?: Date;
}
