import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongoErrCodes } from '../constants/enums/mongo-err-code.enum';
import { Response, Request } from 'express';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const i18n = getI18nContextFromArgumentsHost(host);
    switch (exception.code) {
      case MongoErrCodes.DUPLICATE_KEY:
        response.status(500).json({
          statusCode: 500,
          message: exception.message,
          error: i18n.t('errors.MONGO.DUPLICATE_KEY'),
        });
        break;
      default:
        console.error(`${exception.code} ${exception.message}`);
        break;
    }
  }
}
