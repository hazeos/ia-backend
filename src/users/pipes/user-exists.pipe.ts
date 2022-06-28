import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
} from '@nestjs/common';
import { UsersServiceToken } from '../../domain/di.tokens';
import { IUsersService } from '../interfaces/users-service.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserExistsException } from '../exceptions/user-exists.exception';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserExistsValidationPipe<T>
  implements PipeTransform<T, Promise<void>>
{
  constructor(
    @Inject(UsersServiceToken)
    private readonly usersService: IUsersService<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
  ) {}
  async transform(value: T, metadata: ArgumentMetadata): Promise<void> {
    const object = plainToInstance(metadata.metatype, value);
    const user = await this.usersService.findOne({ email: object.email });
    if (user) {
      throw new UserExistsException();
    }
  }
}
