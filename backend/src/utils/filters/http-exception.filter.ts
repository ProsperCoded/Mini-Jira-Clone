import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../response.dto';
import { DEFAULT_ERROR_MESSAGE } from '../config/constants.config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = DEFAULT_ERROR_MESSAGE;
    let error: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || exception.message;

      error = {
        name: exception.name,
        cause: exception.cause,
        path: ctx.getRequest().url,
        statusCode: statusCode,
      };
    } else {
      error = {
        name: exception.name,
        cause: exception.cause,
        path: ctx.getRequest().url,
        statusCode: statusCode,
      };
      // Log unexpected errors
      console.error('Unexpected error:', exception);
    }

    const errorResponse = ResponseDto.error(message, error, statusCode);
    response.status(statusCode).json(errorResponse);
  }
}
