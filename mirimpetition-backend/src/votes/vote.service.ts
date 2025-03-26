import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote, VoteType } from '../entities/vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) {}

  async findByUserId(userId: string): Promise<Vote[]> {
    return this.voteRepository.find({
      where: { userId },
      relations: ['petition'],
    });
  }

  async create(userId: string, petitionId: string, type: VoteType): Promise<Vote> {
    const existingVote = await this.voteRepository.findOne({
      where: { userId, petitionId },
    });

    if (existingVote) {
      throw new Error('User has already voted on this petition');
    }

    const vote = this.voteRepository.create({
      userId,
      petitionId,
      type,
    });

    return this.voteRepository.save(vote);
  }

  async findOne(id: string): Promise<Vote> {
    const vote = await this.voteRepository.findOne({
      where: { id },
      relations: ['user', 'petition'],
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    return vote;
  }

  async remove(id: string): Promise<void> {
    const result = await this.voteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Vote not found');
    }
  }
} 