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
import { HideProperties } from '../decorators/hide-properties.decorator';
import { HidePropertiesInterceptor } from '../interceptors/hide-properties.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<object> {
    return this.authService.login(req.user);
  }

  @HideProperties('password', 'email')
  @RequiredPermissions(permissions.profile.read)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(HidePropertiesInterceptor)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    console.log(req.user);
    return await req.user;
  }
}
