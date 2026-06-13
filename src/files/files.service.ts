import { Inject, Injectable } from '@nestjs/common';
import { STORAGE_STRATEGY } from '../storage/constants/storage.constants';
import { type StorageStrategy, FileUploadResult } from '../storage/interfaces/storage-strategy.interface';

@Injectable()
export class FilesService {
    
  constructor(
    @Inject(STORAGE_STRATEGY)
    private readonly storage: StorageStrategy,
  ) {}

  uploadFile(file: Express.Multer.File): Promise<FileUploadResult> {
    return this.storage.upload(file);
  }

  uploadFiles(files: Express.Multer.File[]): Promise<FileUploadResult[]> {
    return this.storage.uploadMany(files);
  }

  getFile(identifier: string): Promise<Buffer | NodeJS.ReadableStream> {
    return this.storage.getFile(identifier);
  }
}