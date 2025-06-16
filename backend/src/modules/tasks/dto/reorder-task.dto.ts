import { IsString, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class ReorderTaskDto {
  @IsString()
  taskId: string;

  @IsInt({ message: 'Order must be an integer' })
  @Min(0, { message: 'Order must be non-negative' })
  @Transform(({ value }) => parseInt(value))
  newOrder: number;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid status value' })
  newStatus?: TaskStatus;
}
