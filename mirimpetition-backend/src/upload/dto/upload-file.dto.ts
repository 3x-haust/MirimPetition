import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  @IsString()
  file: Express.Multer.File;
} 