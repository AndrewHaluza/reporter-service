import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger = new Logger('Filter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    this.logger.error(`${exception.message}[${status}]`, exception.stack);

    if (
      exception instanceof NotFoundException ||
      exception instanceof ForbiddenException ||
      exception instanceof ConflictException ||
      exception instanceof UnauthorizedException ||
      exception instanceof BadRequestException ||
      exception.code === 'ValidationException'
    ) {
      return res.status(status).json(exception.response);
    }

    return res.status(status).json({
      message: 'InternalServerError',
    });
  }
}
