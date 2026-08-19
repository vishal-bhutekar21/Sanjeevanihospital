import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse?.message
        ? exceptionResponse.message
        : exception instanceof Error
        ? exception.message
        : 'Internal Server Error';

    const errorCode =
      typeof exceptionResponse === 'object' && exceptionResponse?.error
        ? exceptionResponse.error
        : 'INTERNAL_ERROR';

    this.logger.error(
      `HTTP ${status} on ${request.method} ${request.url}: ${JSON.stringify(message)}`,
    );

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: Array.isArray(message) ? message[0] : message,
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
