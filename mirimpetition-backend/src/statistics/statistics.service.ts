import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Petition } from '../entities/petition.entity';
import { User } from '../entities/user.entity';
import { subDays } from 'date-fns';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getPetitionStatistics(startDate?: string, endDate?: string) {
    const where = {};
    if (startDate && endDate) {
      where['createdAt'] = Between(new Date(startDate), new Date(endDate));
    }

    const [total, active, closed] = await Promise.all([
      this.petitionRepository.count(where),
      this.petitionRepository.createQueryBuilder('petition')
        .where('petition.status = :status', { status: 'active' })
        .andWhere(where)
        .getCount(),
      this.petitionRepository.createQueryBuilder('petition')
        .where('petition.status = :status', { status: 'closed' })
        .andWhere(where)
        .getCount(),
    ]);

    return {
      total,
      active,
      closed,
      approvalRate: total > 0 ? (closed / total) * 100 : 0,
    };
  }

  async getCategoryStatistics() {
    const petitions = await this.petitionRepository.find();
    const categories = {};

    petitions.forEach(petition => {
      if (!categories[petition.category]) {
        categories[petition.category] = {
          total: 0,
          active: 0,
          closed: 0,
        };
      }

      categories[petition.category].total++;
      if (petition.status === 'active') {
        categories[petition.category].active++;
      } else if (petition.status === 'closed') {
        categories[petition.category].closed++;
      }
    });

    return categories;
  }

  async getUserStatistics() {
    const [totalUsers, activeUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.votes', 'vote')
        .where('vote.createdAt >= :date', {
          date: subDays(new Date(), 30),
        })
        .getCount(),
    ]);

    const topContributors = await this.userRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.petitionCount', 'user.petitions')
      .loadRelationCountAndMap('user.voteCount', 'user.votes')
      .orderBy('user.petitionCount', 'DESC')
      .addOrderBy('user.voteCount', 'DESC')
      .take(10)
      .getMany();

    return {
      totalUsers,
      activeUsers,
      activityRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
      topContributors: topContributors.map(user => ({
        id: user.id,
        name: user.name,
        petitionCount: user['petitionCount'],
        voteCount: user['voteCount'],
      })),
    };
  }

  async getPopularPetitions(limit: number = 10, period: string) {
    const date = new Date();
    switch (period) {
      case '24h':
        date.setHours(date.getHours() - 24);
        break;
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }

    const petitions = await this.petitionRepository
      .createQueryBuilder('petition')
      .leftJoinAndSelect('petition.votes', 'vote')
      .where('petition.createdAt >= :date', { date })
      .orderBy('petition.voteCount', 'DESC')
      .take(limit)
      .getMany();

    return petitions.map(petition => ({
      id: petition.id,
      title: petition.title,
      category: petition.category,
      status: petition.status,
      voteCount: petition.voteCount,
      createdAt: petition.createdAt,
    }));
  }
} 