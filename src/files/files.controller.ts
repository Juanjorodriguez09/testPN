import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { memoryStorage } from 'multer';
import { Readable } from 'stream';
import { FilesService } from './files.service';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { Public } from '../common/decorators';
import * as mime from 'mime-types';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = /image\/(jpeg|png|gif|webp)|application\/(pdf)/;

@ApiTags('files')
@Controller('files')
export class FilesController {

    constructor(
        private readonly filesService: FilesService
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: MAX_SIZE }),
                new FileTypeValidator({ fileType: ALLOWED_TYPES }),
            ],
            }),
        )
        file: Express.Multer.File,
    ): Promise<UploadFileResponseDto> {
        return this.filesService.uploadFile(file);
    }

    @Post('upload-many')
    @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
    async uploadFiles( @UploadedFiles() files: Express.Multer.File[] ): Promise<UploadFileResponseDto[]> {
        if (!files?.length) throw new BadRequestException('No se enviaron archivos');
        return this.filesService.uploadFiles(files);
    }

    @Public()
    @Get(':filename')
    async getFile( @Param('filename') filename: string, @Res({ passthrough: true }) res: Response ): Promise<StreamableFile> {
        const file = await this.filesService.getFile(filename);

        const contentType = mime.lookup(filename) || 'application/octet-stream';
        const isInline = contentType.startsWith('image/') || contentType === 'application/pdf';

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `${isInline ? 'inline' : 'attachment'}; filename="${filename}"`,
        });

        return Buffer.isBuffer(file)
            ? new StreamableFile(file)
            : new StreamableFile(file as Readable);
    }
}