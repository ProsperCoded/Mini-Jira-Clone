import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class InviteUserDto {
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either ADMIN or MEMBER' })
  role?: UserRole;
}
