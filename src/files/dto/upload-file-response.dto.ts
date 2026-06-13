import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {

  @ApiProperty({ example: 'a1b2c3.jpg' })
  filename?: string;

  @ApiProperty({ example: './uploads/a1b2c3.jpg' })
  path?: string;

  @ApiProperty({ example: 204800 })
  size?: number;

  @ApiProperty({ example: 'image/jpeg' })
  mimetype?: string;
}