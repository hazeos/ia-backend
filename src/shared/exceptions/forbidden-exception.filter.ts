import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const statusCode = exception.getStatus();
    response.status(statusCode).json({
      statusCode: statusCode,
      message: exception.message,
      error: i18n.t('errors.HTTP.FORBIDDEN'),
    });
  }
}
