import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { BadRequestExceptionType } from '../../shared/exceptions/exceptions.types';

@Injectable()
export class FileMimeTypeValidationPipe implements PipeTransform {
  async transform(
    value: Express.Multer.File,
    metadata: ArgumentMetadata,
  ): Promise<Express.Multer.File> {
    const allowedMimeTypes = process.env.ALLOWED_MIME_TYPES.split(',');
    if (!allowedMimeTypes.includes(value.mimetype)) {
      await unlink(
        join(process.cwd(), process.env.UPLOAD_PATH, value.originalname),
      );
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        i18nMessage: 'validation.FILES.UNSUPPORTED_MIME_TYPE',
        i18nArgs: [
          {
            key: 'mimeType',
            pathToValue: 'file.mimetype',
            valueFrom: 'request',
          },
          {
            key: 'originalName',
            pathToValue: 'file.originalname',
            valueFrom: 'request',
          },
        ],
        i18nErrorText: 'errors.HTTP.BAD_REQUEST',
      } as BadRequestExceptionType);
    }
    return value;
  }
}
