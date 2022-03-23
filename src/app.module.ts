import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const env = process.env.NODE_ENV;

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: `.env.${env}` })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
