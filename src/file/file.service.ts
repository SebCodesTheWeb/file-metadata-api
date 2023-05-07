import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { FileDTO } from './file.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

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

  async uploadFile(file: Express.File): Promise<File> {
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
