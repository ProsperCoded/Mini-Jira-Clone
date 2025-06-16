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
import { TeamsService } from './teams.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  JoinTeamDto,
  InviteUserDto,
  TeamQueryDto,
} from './dto';
import {
  TeamResponse,
  TeamMemberResponse,
  TeamStats,
} from '../../types/team.types';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ResponseDto } from 'src/utils/response.dto';
import { AuthUser } from 'src/types/auth.types';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  async createTeam(
    @Body() createTeamDto: CreateTeamDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamResponse>> {
    const team = await this.teamsService.createTeam(user.id, createTeamDto);
    return ResponseDto.created(team, 'Team created successfully');
  }

  @Get()
  async getPublicTeams(@Query() query: TeamQueryDto): Promise<
    ResponseDto<{
      teams: TeamResponse[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const result = await this.teamsService.getPublicTeams(query);
    return ResponseDto.ok(result, 'Public teams retrieved successfully');
  }

  @Get('my-teams')
  async getUserTeams(
    @GetUser() user: AuthUser,
    @Query() query: TeamQueryDto,
  ): Promise<
    ResponseDto<{
      teams: TeamResponse[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    const result = await this.teamsService.getUserTeams(user.id, query);
    return ResponseDto.ok(result, 'User teams retrieved successfully');
  }

  @Get(':id')
  async getTeam(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamResponse>> {
    const team = await this.teamsService.getTeamById(id, user.id);
    return ResponseDto.ok(team, 'Team retrieved successfully');
  }

  @Post('join')
  async joinTeam(
    @Body() joinTeamDto: JoinTeamDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamMemberResponse>> {
    const member = await this.teamsService.joinTeam(user.id, joinTeamDto);
    return ResponseDto.ok(member, 'Successfully joined the team');
  }

  @Post(':id/leave')
  async leaveTeam(
    @Param('id') teamId: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<void>> {
    await this.teamsService.leaveTeam(user.id, teamId);
    return ResponseDto.ok(undefined, 'Successfully left the team');
  }

  @Put(':id')
  async updateTeam(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamResponse>> {
    const team = await this.teamsService.updateTeam(user.id, id, updateTeamDto);
    return ResponseDto.ok(team, 'Team updated successfully');
  }

  @Post(':id/regenerate-join-code')
  async regenerateJoinCode(
    @Param('id') teamId: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<{ joinCode: string }>> {
    const result = await this.teamsService.regenerateJoinCode(user.id, teamId);
    return ResponseDto.ok(result, 'Join code regenerated successfully');
  }

  @Get(':id/members')
  async getTeamMembers(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamMemberResponse[]>> {
    const members = await this.teamsService.getTeamMembers(id, user.id);
    return ResponseDto.ok(members, 'Team members retrieved successfully');
  }

  @Post(':id/members')
  async inviteUser(
    @Param('id') id: string,
    @Body() inviteUserDto: InviteUserDto,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamMemberResponse>> {
    const member = await this.teamsService.inviteUser(
      user.id,
      id,
      inviteUserDto,
    );
    return ResponseDto.ok(member, 'User invited successfully');
  }

  @Delete(':id/members/:userId')
  async removeUser(
    @Param('id') teamId: string,
    @Param('userId') targetUserId: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<void>> {
    await this.teamsService.removeUser(user.id, teamId, targetUserId);
    return ResponseDto.ok(undefined, 'User removed successfully');
  }

  @Delete(':id')
  async deleteTeam(
    @Param('id') teamId: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<void>> {
    await this.teamsService.deleteTeam(user.id, teamId);
    return ResponseDto.ok(undefined, 'Team deleted successfully');
  }

  @Get(':id/stats')
  async getTeamStats(
    @Param('id') id: string,
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<TeamStats>> {
    const stats = await this.teamsService.getTeamStats(id, user.id);
    return ResponseDto.ok(stats, 'Team statistics retrieved successfully');
  }

  @Get('user/team-ids')
  async getUserTeamIds(
    @GetUser() user: AuthUser,
  ): Promise<ResponseDto<string[]>> {
    const teamIds = await this.teamsService.getUserTeamIds(user.id);
    return ResponseDto.ok(teamIds, 'User team IDs retrieved successfully');
  }
}
