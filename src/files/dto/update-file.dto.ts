import { CreateFileDto } from './create-file.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateFileDto extends PickType(CreateFileDto, [
  'name',
  'path',
  'updatedBy',
] as const) {}
