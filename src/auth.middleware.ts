import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const allowedApiKeys = process.env.API_KEYS?.split(',') || [];

    if (typeof apiKey === 'string' && !allowedApiKeys.includes(apiKey)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
