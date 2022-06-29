import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const RequiredPermissions = (
  ...permissions: string[]
): CustomDecorator => SetMetadata('permissions', permissions);
