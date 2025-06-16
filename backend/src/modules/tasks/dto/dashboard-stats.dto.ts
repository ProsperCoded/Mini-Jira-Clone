import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardStatsDto {
  @IsOptional()
  @IsInt({ message: 'Important tasks limit must be an integer' })
  @Min(1, { message: 'Important tasks limit must be at least 1' })
  @Max(20, { message: 'Important tasks limit cannot exceed 20' })
  @Transform(({ value }) => (value ? parseInt(value) : 5))
  importantTasksLimit?: number = 5;
}
