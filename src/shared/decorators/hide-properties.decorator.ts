import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const HideProperties = (...properties: string[]): CustomDecorator =>
  SetMetadata('propertiesToHide', properties);
