import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HidePropertiesInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const propertiesToHide = this.reflector.get<string[]>(
      'propertiesToHide',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const resource = request.url.split('/').pop();
    const user = request.user as User;
    const userPermissions = user.role.permissions
      .map((permission) => permission.name)
      .filter((permission) => permission.includes(resource));
    if (userPermissions.includes(`permissions.${resource}.read_full`)) {
      return next.handle();
    } else {
      return next.handle().pipe(
        map((value) => {
          propertiesToHide.forEach((property) => {
            delete value[property];
          });
          return value;
        }),
      );
    }
  }
}
