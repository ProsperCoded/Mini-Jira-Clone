export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export class ResponseUtil {
  /**
   * Create a success response
   */
  static success<T>(
    data?: T,
    message: string = 'Operation successful',
    meta?: ApiResponse['meta'],
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  /**
   * Create an error response
   */
  static error(
    message: string = 'Operation failed',
    error?: string,
    errors?: string[],
  ): ApiResponse {
    return {
      success: false,
      message,
      error,
      errors,
    };
  }

  /**
   * Create a validation error response
   */
  static validationError(errors: string[]): ApiResponse {
    return {
      success: false,
      message: 'Validation failed',
      errors,
    };
  }

  /**
   * Create an unauthorized response
   */
  static unauthorized(message: string = 'Unauthorized access'): ApiResponse {
    return {
      success: false,
      message,
      error: 'UNAUTHORIZED',
    };
  }

  /**
   * Create a forbidden response
   */
  static forbidden(message: string = 'Access forbidden'): ApiResponse {
    return {
      success: false,
      message,
      error: 'FORBIDDEN',
    };
  }

  /**
   * Create a not found response
   */
  static notFound(message: string = 'Resource not found'): ApiResponse {
    return {
      success: false,
      message,
      error: 'NOT_FOUND',
    };
  }

  /**
   * Create a conflict response
   */
  static conflict(message: string = 'Resource conflict'): ApiResponse {
    return {
      success: false,
      message,
      error: 'CONFLICT',
    };
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Data retrieved successfully',
  ): ApiResponse<T[]> {
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message,
      data,
      meta: {
        total,
        page,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
