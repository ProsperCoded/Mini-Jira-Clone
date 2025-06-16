import { User } from '@prisma/client';
import { AuthUser } from '../types/auth.types';

export class UserProfileUtil {
  /**
   * Formats a user object to exclude sensitive information.
   * @param user - The full user object from the database.
   * @returns A safe user object for API responses or null.
   */
  static formatUserProfile(user: User): AuthUser | null {
    if (!user) {
      return null;
    }

    const { password, ...rest } = user;

    const profile: AuthUser = {
      ...rest,
      firstName: rest.firstName || null,
      lastName: rest.lastName || null,
    };

    return profile;
  }
}
