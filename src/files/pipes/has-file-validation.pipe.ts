import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { BadRequestExceptionType } from '../../shared/exceptions/exceptions.types';

@Injectable()
export class HasFileValidationPipe implements PipeTransform {
  transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Express.Multer.File {
    if (!value) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        i18nMessage: 'validation.FILES.NO_FILE',
        i18nErrorText: 'errors.HTTP.BAD_REQUEST',
        i18nArgs: [],
      } as BadRequestExceptionType);
    } else {
      return value;
    }
  }
}
