import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { Role, RoleSchema } from '../schemas/role.schema';
import { Permission, PermissionSchema } from '../schemas/permission.schema';
import { UsersRepository } from './users.repository';
import { IUsersRepositoryToken, IUsersServiceToken } from '../domain/di.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserEntity },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  providers: [
    { provide: IUsersServiceToken, useClass: UsersService },
    { provide: IUsersRepositoryToken, useClass: UsersRepository },
  ],
  controllers: [UsersController],
  exports: [{ provide: IUsersServiceToken, useClass: UsersService }],
})
export class UsersModule {}
