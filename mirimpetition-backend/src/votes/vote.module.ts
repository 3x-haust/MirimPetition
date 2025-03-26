import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { Vote } from '../entities/vote.entity';
import { Petition } from '../entities/petition.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Petition, User])],
  controllers: [VoteController],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {} 