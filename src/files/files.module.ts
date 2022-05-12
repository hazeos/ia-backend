import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileEntity } from './entities/file.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileEntity }]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
