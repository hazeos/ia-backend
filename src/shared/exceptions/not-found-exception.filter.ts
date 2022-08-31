import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { NotFoundExceptionBodyType } from './exceptions.types';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const error = exception.getResponse() as NotFoundExceptionBodyType;
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: i18n.t(error.i18nMessage),
      error: i18n.t(error.i18nErrorText),
    });
  }
}
