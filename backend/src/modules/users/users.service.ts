import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../utils/prisma.service';
import { User } from '@prisma/client';
import { RegisterDto } from '../auth/dto/register.dto';
import { PasswordUtil } from '../../utils/password.util';
import { ValidationUtil } from '../../utils/validation.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new user in the database.
   * @param registerDto - The user registration data.
   * @returns The newly created user object.
   * @throws ConflictException if email or username already exists.
   */
  async create(registerDto: RegisterDto): Promise<User> {
    const { email, username, password, firstName, lastName } = registerDto;

    // Check for existing user
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException(
          'An account with this email already exists.',
        );
      }
      if (existingUser.username === username) {
        throw new ConflictException('This username is already taken.');
      }
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(password);

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName: firstName ? ValidationUtil.sanitizeString(firstName) : null,
        lastName: lastName ? ValidationUtil.sanitizeString(lastName) : null,
      },
    });

    return newUser;
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The user's ID.
   * @returns The user object or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    if (!ValidationUtil.isValidCUID(id)) {
      return null;
    }
    return this.prisma.user.findFirst({ where: { id } });
  }

  /**
   * Finds a user by their email address.
   * @param email - The user's email.
   * @returns The user object or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } });
  }

  /**
   * Finds a user by their username.
   * @param username - The user's username.
   * @returns The user object or null if not found.
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { username } });
  }

  /**
   * Gets the profile of a user.
   * @param userId - The ID of the user.
   * @returns The user object.
   * @throws NotFoundException if the user is not found.
   */
  async getProfile(userId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
