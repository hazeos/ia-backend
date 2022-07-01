import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { NotFoundExceptionType } from '../exceptions/exceptions.types';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.MONGO.INVALID_OBJECT_ID',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionType);
    }
    return value;
  }
}
