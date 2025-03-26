import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PetitionStatus, PetitionCategory } from '../../entities/petition.entity';

export class SearchPetitionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PetitionStatus)
  status?: PetitionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PetitionCategory)
  category?: PetitionCategory;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
} 