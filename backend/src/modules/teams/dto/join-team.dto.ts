import { IsString, IsOptional, ValidateIf } from 'class-validator';

export class JoinTeamDto {
  @ValidateIf((o) => !o.joinCode)
  @IsString({ message: 'Team ID must be a string' })
  teamId?: string;

  @ValidateIf((o) => !o.teamId)
  @IsString({ message: 'Join code must be a string' })
  joinCode?: string;
}
