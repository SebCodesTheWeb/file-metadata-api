import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { FileDTO } from './file.dto';
import { v4 as uuidv4 } from 'uuid';
import { s3 } from './s3-client';
import { Readable } from 'stream';

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

  async getFile(fileId: string): Promise<File> {
    const file = await this.fileRepo.findOneBy({ id: fileId });
    return file;
  }

  async deleteFile(file: File): Promise<void> {
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.s3_key,
    };

    await s3.deleteObject(s3Params).promise();
    await this.fileRepo.delete(file.id);
  }

  async downloadFile(file_s3_key: string): Promise<Readable> {
    const downloadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file_s3_key,
    };

    const s3ReadStream = s3.getObject(downloadParams).createReadStream();
    return s3ReadStream;
  }

  async uploadFile(file: Express.Multer.File): Promise<File> {
    const s3Key = uuidv4();
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.upload(uploadParams).promise();

    const newFile = this.fileRepo.create({
      original_name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      s3_key: s3Key,
    });

    return this.fileRepo.save(newFile);
  }
}
