import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { NotFoundExceptionType } from './exceptions.types';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const error = exception.getResponse() as NotFoundExceptionType;
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: i18n.t(error.i18nMessageCode),
      error: i18n.t(error.i18nErrorTextCode),
    });
  }
}
