import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Inject,
} from '@nestjs/common';
import { UsersRepositoryToken } from '../../shared/di.tokens';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserExistsException } from '../exceptions/user-exists.filter';
import { plainToInstance } from 'class-transformer';
import { IUsersRepository } from '../interfaces/users-repository.interface';

@Injectable()
export class UserExistsValidationPipe<T>
  implements PipeTransform<T, Promise<T>>
{
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
  ) {}
  async transform(value: T, metadata: ArgumentMetadata): Promise<T> {
    const object = plainToInstance(metadata.metatype, value);
    const user = await this.usersRepository.findOne({ email: object.email });
    if (user) {
      throw new UserExistsException();
    }
    return value;
  }
}
