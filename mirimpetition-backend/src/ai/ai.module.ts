import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Petition } from '../entities/petition.entity';
import { User } from '../entities/user.entity';
import { PetitionModule } from '../petitions/petition.module';
import { VoteModule } from '../votes/vote.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Petition, User]),
    ConfigModule,
    PetitionModule,
    VoteModule,
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {} 