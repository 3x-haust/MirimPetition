import { Injectable, BadRequestException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file: Express.Multer.File, type: string): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large');
    }

    const fileExtension = file.originalname.split('.').pop();
    const key = `${type}/${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: this.configService.get('AWS_S3_BUCKET'),
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

    try {
      const result = await this.s3.upload(uploadParams).promise();
      return { url: result.Location };
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = fileUrl.split('/').pop();
      const deleteParams = {
        Bucket: this.configService.get('AWS_S3_BUCKET'),
        Key: key,
      };
      await this.s3.deleteObject(deleteParams).promise();
    } catch (error) {
      throw new BadRequestException('Failed to delete file');
    }
  }
} 