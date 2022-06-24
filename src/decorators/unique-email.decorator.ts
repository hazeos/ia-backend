import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { UsersServiceToken } from '../domain/di.tokens';
import { IUsersService } from '../users/interfaces/users-service.interface';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { ClassConstructor } from 'class-transformer';

export const IsEmailAlreadyExist = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => string | number,
  validationOptions?: ValidationOptions,
) => {
  return (object: T, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'IsEmailAlreadyExistConstraint', async: true })
@Injectable()
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  // TODO Инъекция сервиса не работает, следовательно валидатор тоже
  constructor(
    @Inject(UsersServiceToken)
    protected readonly usersService: IUsersService<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
  ) {}
  async validate(email: string, args: ValidationArguments): Promise<boolean> {
    return await this.usersService
      .findOne({ email: email })
      .then((user) => !user);
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.property} already exists`;
  }
}
