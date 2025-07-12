// src/types/express-fileupload.d.ts
import { UploadedFile, FileArray } from 'express-fileupload';

declare global {
  namespace Express {
    interface Request {
      files?: FileArray;
    }
  }
}
