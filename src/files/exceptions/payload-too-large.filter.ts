import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PayloadTooLargeException } from '@nestjs/common/exceptions/payload-too-large.exception';
import { Request, Response } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(PayloadTooLargeException)
export class PayloadTooLargeExceptionFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    const statusCode = exception.getStatus();
    response.status(statusCode).json({
      statusCode: statusCode,
      message: exception.message,
      errors: [
        i18n.t('validation.FILES.TOO_LARGE', {
          args: { size: +process.env.FILE_MAX_SIZE / 1024 / 1024 },
        }),
      ],
    });
  }
}
