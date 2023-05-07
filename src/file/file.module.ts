import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FileUploadMiddleware } from './file-upload.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  exports: [TypeOrmModule],
})
export class FileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FileUploadMiddleware)
      .forRoutes({ path: 'file/upload', method: RequestMethod.POST });
  }
}
