import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Param,
  Delete,
} from '@nestjs/common';
import { FileDTO } from './file.dto';
import { FileService } from './file.service';
import { File } from './file.entity';
import { Request, Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  async getFiles(): Promise<File[]> {
    const files = await this.fileService.getAll();
    return files;
  }

  @Delete(':id')
  async deleteFile(@Param('id') fileId: string, @Res() res: Response) {
    const file = await this.fileService.getFile(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await this.fileService.deleteFile(file);

    return res.status(200).json({ message: 'File deleted successfully' });
  }

  @Get('download/:id')
  async downloadFile(@Param('id') fileId: string, @Res() res: Response) {
    const file = await this.fileService.getFile(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileStream = await this.fileService.downloadFile(file.s3_key);

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.original_name}`,
    );
    fileStream.pipe(res);
  }

  @Post()
  addFile(@Body() fileData: FileDTO): string {
    this.fileService.addFile(fileData);
    return 'Added file';
  }

  @Post('upload')
  async uploadFile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    if (!req.file) {
      return res.status(400).json({ message: 'No file found' });
    }

    const file = await this.fileService.uploadFile(req.file);
    return res.status(201).json(file);
  }
}
