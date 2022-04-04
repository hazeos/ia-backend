import {
  CallHandler,
  ClassSerializerInterceptor,
  ExecutionContext,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from '../schemas/user.schema';

export const MongooseClassSerializerInterceptor = (
  classToIntercept: Type,
): typeof ClassSerializerInterceptor => {
  return class Interceptor extends ClassSerializerInterceptor {
    private role: string;

    private changePlainObjectToClass(
      document: PlainLiteralObject,
      options: ClassTransformOptions,
    ): any {
      if (!(document instanceof Document)) {
        return document;
      }
      return plainToInstance(classToIntercept, document.toJSON(), options);
    }

    // private prepareResponse(
    //   response: PlainLiteralObject | PlainLiteralObject[],
    // ): any {
    //   if (Array.isArray(response)) {
    //     return response.map(this.changePlainObjectToClass);
    //   }
    //
    //   return this.changePlainObjectToClass(response);
    // }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const user = request.user as User;
      this.role = user.role.name;
      return super.intercept(context, next);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
      const opts = { groups: [this.role] } as ClassTransformOptions;
      return super.serialize(
        this.changePlainObjectToClass(response, opts),
        opts,
      );
    }
  };
};
