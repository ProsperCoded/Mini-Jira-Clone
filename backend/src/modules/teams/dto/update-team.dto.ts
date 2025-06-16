import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TeamType } from '@prisma/client';

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Team name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Team name must be at most 50 characters long' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Description must be at most 500 characters long',
  })
  description?: string;

  @IsOptional()
  @IsEnum(TeamType, { message: 'Type must be either PUBLIC or PRIVATE' })
  type?: TeamType;
}
