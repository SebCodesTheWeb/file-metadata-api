import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  exports: [TypeOrmModule],
})
export class FileModule {}
