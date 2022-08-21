import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { BadRequestExceptionType } from './exceptions.types';
import { getObjectPropertyByString } from '../functions/get-property-by-string.function';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const error = exception.getResponse() as BadRequestExceptionType;
    const args = error.i18nArgs.map((arg) => {
      switch (arg.valueFrom) {
        case 'request':
          return {
            [arg.key]: getObjectPropertyByString(request, arg.pathToValue),
          };
        case 'host':
          return {
            [arg.key]: getObjectPropertyByString(host, arg.pathToValue),
          };
      }
    });
    response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: i18n.t(error.i18nMessage, {
        args: args,
      }),
      errors: [i18n.t(error.i18nErrorText)],
    });
  }
}
