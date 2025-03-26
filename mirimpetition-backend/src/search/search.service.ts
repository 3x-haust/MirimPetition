import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Petition } from '../entities/petition.entity';
import { PetitionStatus, PetitionCategory } from '../entities/petition.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Petition)
    private petitionRepository: Repository<Petition>,
  ) {}

  async searchPetitions(query: string, filters?: {
    status?: PetitionStatus;
    category?: PetitionCategory;
    page?: number;
    limit?: number;
  }) {
    const { status, category, page = 1, limit = 10 } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (query) {
      where.title = ILike(`%${query}%`);
    }

    const [petitions, total] = await this.petitionRepository.findAndCount({
      where,
      relations: ['author', 'votes'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      petitions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPopularPetitions(limit = 10) {
    return this.petitionRepository.find({
      relations: ['author', 'votes'],
      order: { voteCount: 'DESC' },
      take: limit,
    });
  }

  async getRecentPetitions(limit = 10) {
    return this.petitionRepository.find({
      relations: ['author', 'votes'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
} 