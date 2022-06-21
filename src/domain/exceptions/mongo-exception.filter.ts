import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongoErrCodes } from '../../shared/constants/enums/mongo-err-code.enum';
import { Response, Request } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    switch (exception.code) {
      case MongoErrCodes.DUPLICATE_KEY:
        response.status(500).json({
          statusCode: 500,
          timestamp: new Date().toISOString(),
          message: '',
          path: request.url,
        });
        break;
    }
  }
}
