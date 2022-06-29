import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { Role, RoleSchema } from '../schemas/role.schema';
import { Permission, PermissionSchema } from '../schemas/permission.schema';
import { UsersRepository } from './users.repository';
import { UsersRepositoryToken, UsersServiceToken } from '../shared/di.tokens';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserEntity },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: UsersServiceToken, useClass: UsersService },
    { provide: UsersRepositoryToken, useClass: UsersRepository },
  ],
  exports: [{ provide: UsersServiceToken, useClass: UsersService }],
})
export class UsersModule {}
