import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, Min, IsOptional } from 'class-validator';

export enum TimeRange {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export class GetPetitionStatsDto {
  @ApiProperty({ enum: TimeRange, default: TimeRange.MONTH })
  @IsEnum(TimeRange)
  timeRange: TimeRange = TimeRange.MONTH;
}

export class GetTopPetitionsDto {
  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
} 