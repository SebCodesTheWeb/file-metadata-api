import { Controller, Get, Post, Body } from '@nestjs/common';
import { FileDTO } from './file.dto';
import { FileService } from './file.service';
import { File } from './file.entity';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  async getFiles(): Promise<File[]> {
    const files = await this.fileService.getAll();
    return files;
  }

  @Post()
  addFile(@Body() fileData: FileDTO): string {
    this.fileService.addFile(fileData);
    return 'Added file';
  }
}
