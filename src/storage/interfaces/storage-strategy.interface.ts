
export interface FileUploadResult {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface StorageStrategy {
  upload(file: Express.Multer.File): Promise<FileUploadResult>;
  uploadMany(files: Express.Multer.File[]): Promise<FileUploadResult[]>;
  getFile(identifier: string): Promise<Buffer | NodeJS.ReadableStream>;
  deleteFile(identifier: string): Promise<void>;
}