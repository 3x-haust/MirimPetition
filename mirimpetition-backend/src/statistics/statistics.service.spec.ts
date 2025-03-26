import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatisticsService } from './statistics.service';
import { Petition } from '../entities/petition.entity';
import { Vote } from '../entities/vote.entity';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let petitionRepository: Repository<Petition>;
  let voteRepository: Repository<Vote>;

  const mockPetitionRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockVoteRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Petition),
          useValue: mockPetitionRepository,
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    petitionRepository = module.get<Repository<Petition>>(getRepositoryToken(Petition));
    voteRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPetitionStats', () => {
    it('should return petition statistics', async () => {
      const mockStats = {
        totalPetitions: 10,
        totalVotes: 50,
        categoryStats: [
          { category: 'ACADEMIC', count: 5 },
          { category: 'FACILITY', count: 3 },
          { category: 'WELFARE', count: 2 },
        ],
        statusStats: [
          { status: 'ACTIVE', count: 7 },
          { status: 'COMPLETED', count: 3 },
        ],
      };

      mockPetitionRepository.count.mockResolvedValue(10);
      mockVoteRepository.count.mockResolvedValue(50);
      mockPetitionRepository.getRawMany
        .mockResolvedValueOnce(mockStats.categoryStats)
        .mockResolvedValueOnce(mockStats.statusStats);

      const result = await service.getPetitionStats('month');

      expect(result).toEqual({
        ...mockStats,
        timeRange: 'month',
      });
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const userId = 'test-user-id';
      const mockStats = {
        totalPetitions: 5,
        totalVotes: 20,
      };

      mockPetitionRepository.count.mockResolvedValue(5);
      mockVoteRepository.count.mockResolvedValue(20);

      const result = await service.getUserStats(userId);

      expect(result).toEqual(mockStats);
    });
  });

  describe('getTopPetitions', () => {
    it('should return top petitions', async () => {
      const mockPetitions = [
        { id: '1', title: 'Top Petition 1', voteCount: 100 },
        { id: '2', title: 'Top Petition 2', voteCount: 80 },
      ];

      mockPetitionRepository.createQueryBuilder.mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPetitions),
      } as any);

      const result = await service.getTopPetitions(5);

      expect(result).toEqual(mockPetitions);
    });
  });
}); 