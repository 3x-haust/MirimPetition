import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PetitionCategory } from '../../entities/petition.entity';

export class UpdatePetitionDto {
  @ApiPropertyOptional({ description: '청원 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: '청원 내용' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: '청원 카테고리', enum: PetitionCategory })
  @IsEnum(PetitionCategory)
  @IsOptional()
  category?: PetitionCategory;
} 