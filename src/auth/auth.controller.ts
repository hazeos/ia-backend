import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../schemas/user.schema';
import { RequiredPermissions } from '../decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { PermissionsGuard } from './guards/permissions.guard';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class-serializer.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<object> {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @RequiredPermissions(permissions.profile.read)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  async getProfile(@Request() req): Promise<User> {
    console.log(req.user);
    return await req.user;
  }
}
