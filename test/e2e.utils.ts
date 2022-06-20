import { sign } from 'jsonwebtoken';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicModule } from '@nestjs/common';

export const makeTestToken = (
  role: 'admin' | 'moderator' | 'anonymous' | 'guest',
): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error('No access token secret key specified');
    process.exit(1);
  }
  let email: string;
  switch (role) {
    case 'admin':
      email = process.env.ADMIN_AUTH_EMAIL;
      break;
    case 'moderator':
      email = process.env.MODERATOR_AUTH_EMAIL;
      break;
    case 'guest':
      email = process.env.GUEST_AUTH_EMAIL;
      break;
    default:
      email = process.env.ADMIN_AUTH_EMAIL;
  }
  return sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    issuer: process.env.ACCESS_TOKEN_ISSUER,
    audience: process.env.ACCESS_TOKEN_AUDIENCE,
  });
};

export const configTestDb = (): DynamicModule[] => {
  return [
    ConfigModule.forRoot({ envFilePath: '.env.test' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_CONNECTION_STRING'),
      }),
      inject: [ConfigService],
    }),
  ];
};
