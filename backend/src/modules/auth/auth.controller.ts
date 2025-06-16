import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { AuthUser, LoginResponse } from '../../types/auth.types';
import { ResponseUtil, ApiResponse } from '../../utils/response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ApiResponse<LoginResponse>> {
    const data = await this.authService.register(registerDto);
    return ResponseUtil.success(data, 'User registered successfully.');
  }

  /**
   * Logs in an existing user.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<LoginResponse>> {
    const data = await this.authService.login(loginDto);
    return ResponseUtil.success(data, 'Login successful.');
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@GetUser() user: AuthUser): Promise<ApiResponse<AuthUser>> {
    return ResponseUtil.success(user, 'Profile retrieved successfully.');
  }
}
