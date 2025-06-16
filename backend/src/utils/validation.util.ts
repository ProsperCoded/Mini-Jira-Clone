export class ValidationUtil {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate username format
   */
  static isValidUsername(username: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!username || username.trim().length === 0) {
      errors.push('Username is required');
      return { isValid: false, errors };
    }

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (username.length > 30) {
      errors.push('Username must not exceed 30 characters');
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      errors.push(
        'Username can only contain letters, numbers, dots, hyphens, and underscores',
      );
    }

    if (/^[._-]/.test(username) || /[._-]$/.test(username)) {
      errors.push(
        'Username cannot start or end with dots, hyphens, or underscores',
      );
    }

    if (/[._-]{2,}/.test(username)) {
      errors.push(
        'Username cannot contain consecutive dots, hyphens, or underscores',
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate team name
   */
  static isValidTeamName(name: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Team name is required');
      return { isValid: false, errors };
    }

    if (name.trim().length < 2) {
      errors.push('Team name must be at least 2 characters long');
    }

    if (name.trim().length > 100) {
      errors.push('Team name must not exceed 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate task title
   */
  static isValidTaskTitle(title: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Task title is required');
      return { isValid: false, errors };
    }

    if (title.trim().length < 1) {
      errors.push('Task title cannot be empty');
    }

    if (title.trim().length > 200) {
      errors.push('Task title must not exceed 200 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate pagination parameters
   */
  static validatePagination(
    page?: string,
    limit?: string,
  ): { page: number; limit: number } {
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedLimit = limit ? parseInt(limit, 10) : 10;

    return {
      page: isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage,
      limit:
        isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100
          ? 10
          : parsedLimit,
    };
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Check if string is UUID
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Check if string is valid CUID
   */
  static isValidCUID(cuid: string): boolean {
    const cuidRegex = /^c[0-9a-z]{24}$/;
    return cuidRegex.test(cuid);
  }
}
