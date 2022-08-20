import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UnsupportedMimeTypeException } from '../exceptions/file-validation.filter';
import { join } from 'path';
import { unlink } from 'fs/promises';

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
      throw new UnsupportedMimeTypeException();
    }
    return value;
  }
}
