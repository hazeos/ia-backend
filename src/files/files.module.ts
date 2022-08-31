import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileEntity } from './entities/file.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FilesRepositoryToken, FilesServiceToken } from '../shared/di.tokens';
import { FilesRepository } from './files.repository';
import { diskStorage } from 'multer';
import { Request } from 'Express';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileEntity }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOAD_PATH'),
          filename(
            req: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void,
          ) {
            callback(null, Date.now() + extname(file.originalname));
          },
        }),
        limits: {
          fileSize: +configService.get('FILE_MAX_SIZE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FilesController],
  providers: [
    { provide: FilesServiceToken, useClass: FilesService },
    { provide: FilesRepositoryToken, useClass: FilesRepository },
  ],
})
export class FilesModule {}
