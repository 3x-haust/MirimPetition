import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PetitionCategory } from '../../entities/petition.entity';

export class CreatePetitionDto {
  @ApiProperty({ description: '청원 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '청원 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '청원 카테고리', enum: PetitionCategory })
  @IsEnum(PetitionCategory)
  @IsNotEmpty()
  category: PetitionCategory;
} 