import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetitionService } from './petition.service';
import { PetitionController } from './petition.controller';
import { Petition } from '../entities/petition.entity';
import { Vote } from '../entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Petition, Vote])],
  controllers: [PetitionController],
  providers: [PetitionService],
  exports: [PetitionService],
})
export class PetitionModule {} 