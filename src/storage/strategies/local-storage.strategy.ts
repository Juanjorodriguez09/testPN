import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { StorageStrategy, FileUploadResult } from '../interfaces/storage-strategy.interface';
import { UuidAdapter } from '../../common/adapters/uuid.adapter';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
    
  private readonly logger = new Logger(LocalStorageStrategy.name);
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('LOCAL_UPLOAD_DIR', './uploads');
    this.ensureDir();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File): Promise<FileUploadResult> {
    const ext = path.extname(file.originalname);
    const filename = `${UuidAdapter.getUuid()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filePath, file.buffer);
    this.logger.log(`Archivo guardado: ${filePath}`);

    return { filename, path: filePath, size: file.size, mimetype: file.mimetype };
  }

  async uploadMany(files: Express.Multer.File[]): Promise<FileUploadResult[]> {
    return Promise.all(files.map((f) => this.upload(f)));
  }

  async getFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.uploadDir, filename);
    return fs.promises.readFile(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }
}