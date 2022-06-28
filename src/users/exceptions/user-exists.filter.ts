import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

export class UserExistsException extends HttpException {
  constructor() {
    super('Bad Request', HttpStatus.BAD_REQUEST);
  }
}

@Catch(UserExistsException)
export class UserExistsExceptionFilter implements ExceptionFilter {
  catch(exception: UserExistsException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const statusCode = exception.getStatus();
    response.status(statusCode).json({
      statusCode: statusCode,
      message: exception.getResponse(),
      errors: [
        i18n.t('validation.EMAIL_EXISTS', {
          args: { email: request.body.email },
        }),
      ],
    });
  }
}
