import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: '페이지 번호', minimum: 1, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: '페이지당 항목 수', minimum: 1, default: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number;
} 