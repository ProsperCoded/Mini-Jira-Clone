import { ResponseStatus } from './config/constants.config';

export interface ErrorDetail {
  cause: unknown;
  name: string;
  path: string;
  statusCode: number;
}

export class ResponseDto<T = any> {
  constructor(
    public message: string,
    public status: ResponseStatus,
    public statusCode: number,
    public data?: T,
    public error?: ErrorDetail,
  ) {}

  public static success<T>(
    message: string,
    data?: T,
    statusCode: number = 200,
  ): ResponseDto<T> {
    return new ResponseDto<T>(
      message,
      ResponseStatus.SUCCESS,
      statusCode,
      data,
    );
  }

  public static error<T>(
    message: string,
    error?: ErrorDetail,
    statusCode: number = 500,
  ): ResponseDto<T> {
    return new ResponseDto<T>(
      message,
      ResponseStatus.ERROR,
      statusCode,
      undefined,
      error,
    );
  }

  // Utility methods for common responses
  public static ok<T>(data: T, message: string = 'Success'): ResponseDto<T> {
    return this.success(message, data, 200);
  }

  public static created<T>(
    data: T,
    message: string = 'Created',
  ): ResponseDto<T> {
    return this.success(message, data, 201);
  }

  public static badRequest(
    message: string = 'Bad Request',
    error?: ErrorDetail,
  ): ResponseDto {
    return this.error(message, error, 400);
  }

  public static unauthorized(
    message: string = 'Unauthorized',
    error?: ErrorDetail,
  ): ResponseDto {
    return this.error(message, error, 401);
  }

  public static forbidden(
    message: string = 'Forbidden',
    error?: ErrorDetail,
  ): ResponseDto {
    return this.error(message, error, 403);
  }

  public static notFound(
    message: string = 'Not Found',
    error?: ErrorDetail,
  ): ResponseDto {
    return this.error(message, error, 404);
  }

  public static conflict(
    message: string = 'Conflict',
    error?: ErrorDetail,
  ): ResponseDto {
    return this.error(message, error, 409);
  }

  public static internalError(
    message: string = 'Internal Server Error',
    error?: ErrorDetail,
  ): ResponseDto {
    return this.error(message, error, 500);
  }
}
