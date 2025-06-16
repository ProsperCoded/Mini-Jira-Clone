import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordUtil } from '../../utils/password.util';
import { UserProfileUtil } from '../../utils/user-profile.util';
import { JwtPayload, LoginResponse } from '../../types/auth.types';
import { ValidationUtil } from '../../utils/validation.util';
import { AuthUser } from '../../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user.
   * @param registerDto - The registration data.
   * @returns The newly created user's profile and an access token.
   */
  async register(registerDto: RegisterDto): Promise<LoginResponse> {
    const { email, username, password } = registerDto;

    // Validate email and username formats
    if (!ValidationUtil.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format.');
    }
    const usernameValidation = ValidationUtil.isValidUsername(username);
    if (!usernameValidation.isValid) {
      throw new BadRequestException(usernameValidation.errors.join(', '));
    }

    // Validate password strength
    const passwordValidation = PasswordUtil.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.errors.join(', '));
    }

    try {
      const newUser = await this.usersService.create(registerDto);
      const userProfile = UserProfileUtil.formatUserProfile(newUser);

      if (!userProfile) {
        throw new BadRequestException('Failed to create user profile.');
      }

      const accessToken = await this.generateAccessToken(userProfile);

      return {
        user: userProfile,
        accessToken,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Registration failed. Please try again.');
    }
  }

  /**
   * Logs in a user.
   * @param loginDto - The login data.
   * @returns The user's profile and an access token.
   * @throws UnauthorizedException if credentials are invalid.
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    const isPasswordValid = await PasswordUtil.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    const userProfile = UserProfileUtil.formatUserProfile(user);

    if (!userProfile) {
      throw new UnauthorizedException('Failed to process user profile.');
    }

    const accessToken = await this.generateAccessToken(userProfile);

    return {
      user: userProfile,
      accessToken,
    };
  }

  /**
   * Generates a JWT access token for a user.
   * @param user - The user's profile.
   * @returns A JWT access token.
   */
  private async generateAccessToken(user: AuthUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.signAsync(payload);
  }

  /**
   * Validates a user based on JWT payload.
   * @param payload - The JWT payload.
   * @returns The user's profile, or null.
   */
  async validateUser(payload: JwtPayload): Promise<AuthUser | null> {
    if (!payload || !payload.sub) {
      return null;
    }
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      return null;
    }
    return UserProfileUtil.formatUserProfile(user);
  }
}
