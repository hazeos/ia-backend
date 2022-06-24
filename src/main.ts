import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  useContainer(app.select(AppModule), { fallback: true });
  app.setGlobalPrefix('api/v1');
  await app.listen(port);
}

bootstrap().then();
