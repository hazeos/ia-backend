import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongoErrCodes } from '../shared/constants/enums/mongo-err-code.enum';

// TODO требует тестирования и доработки
@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost): void {
    switch (exception.code) {
      case MongoErrCodes.DUPLICATE_KEY:
        break;
    }
  }
}
