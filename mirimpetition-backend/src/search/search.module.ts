import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { Petition } from '../entities/petition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Petition])],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {} 