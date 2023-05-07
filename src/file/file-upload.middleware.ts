import { Injectable, NestMiddleware } from '@nestjs/common';
import * as multer from 'multer';
import { RequestHandler } from 'express';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private readonly multerMiddleware: RequestHandler;

  constructor() {
    const storage = multer.memoryStorage();
    this.multerMiddleware = multer({ storage }).single('file');
  }

  use(req: any, res: any, next: () => void) {
    this.multerMiddleware(req, res, (error) => {
      if (error) {
        return res.status(400).json({ message: 'Error uploading file' });
      }
      next();
    });
  }
}
