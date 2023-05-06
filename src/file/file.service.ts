import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { FileDTO } from './file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepo: Repository<File>,
  ) {}

  getAll(): Promise<File[]> {
    return this.fileRepo.find();
  }

  async addFile(fileMeta: FileDTO): Promise<void> {
    const extendedFileMeta = {
      ...fileMeta,
      s3_key: 'randomalö-efjika',
    };

    await this.fileRepo.save(extendedFileMeta);
  }
}
