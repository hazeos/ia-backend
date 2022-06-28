import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

// TODO продумать логику и использовать для всех ресурсов приложения, чтобы везде возвращались корректные тексты ошибок Not Found
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const statusCode = exception.getStatus();
    response.status(statusCode).json({
      statusCode: statusCode,
      message: i18n.t('errors.INCORRECT_OBJECT_ID'),
      error: '',
    });
  }
}
