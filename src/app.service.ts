import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello() {
    return {
      message: 'Hello World!',
      info: this.configService.get<string>('EMAIL_USER'),
    };
  }
}
