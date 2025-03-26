import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchService } from './search.service';
import { Petition } from '../entities/petition.entity';

describe('SearchService', () => {
  let service: SearchService;
  let repository: Repository<Petition>;

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    find: jest.fn(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(Petition),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    repository = module.get<Repository<Petition>>(getRepositoryToken(Petition));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchPetitions', () => {
    it('should search petitions with filters', async () => {
      const mockPetitions = [
        { id: '1', title: 'Test Petition 1' },
        { id: '2', title: 'Test Petition 2' },
      ];

      mockRepository.getManyAndCount.mockResolvedValue([mockPetitions, 2]);

      const result = await service.searchPetitions({
        keyword: 'test',
        category: 'ACADEMIC',
        status: 'ACTIVE',
        page: 1,
        limit: 10,
      });

      expect(result).toEqual([mockPetitions, 2]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockRepository.andWhere).toHaveBeenCalledTimes(3);
    });
  });

  describe('getPopularPetitions', () => {
    it('should return popular petitions', async () => {
      const mockPetitions = [
        { id: '1', title: 'Popular Petition 1' },
        { id: '2', title: 'Popular Petition 2' },
      ];

      mockRepository.find.mockResolvedValue(mockPetitions);

      const result = await service.getPopularPetitions(5);

      expect(result).toEqual(mockPetitions);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { voteCount: 'DESC' },
        take: 5,
        relations: ['author'],
      });
    });
  });

  describe('getRecentPetitions', () => {
    it('should return recent petitions', async () => {
      const mockPetitions = [
        { id: '1', title: 'Recent Petition 1' },
        { id: '2', title: 'Recent Petition 2' },
      ];

      mockRepository.find.mockResolvedValue(mockPetitions);

      const result = await service.getRecentPetitions(5);

      expect(result).toEqual(mockPetitions);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['author'],
      });
    });
  });
}); 