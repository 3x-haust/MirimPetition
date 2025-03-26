import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OpenAIApi } from 'openai';
import { AiService } from './ai.service';
import { Petition } from '../entities/petition.entity';
import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';

jest.mock('openai', () => {
  return {
    OpenAIApi: jest.fn().mockImplementation(() => ({
      createCompletion: jest.fn(),
    })),
    Configuration: jest.fn(),
  };
});

describe('AiService', () => {
  let service: AiService;
  let openai: jest.Mocked<OpenAIApi>;

  const mockPetitionRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockVoteRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: getRepositoryToken(Petition),
          useValue: mockPetitionRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVoteRepository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => 'test-key'),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    openai = new OpenAIApi() as jest.Mocked<OpenAIApi>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzePetition', () => {
    it('should analyze a petition', async () => {
      const mockPetition = {
        id: '1',
        title: 'Test Petition',
        content: 'Test Content',
        category: 'ACADEMIC',
        voteCount: 100,
        createdAt: new Date(),
      };

      const mockAnalysis = 'Test analysis result';

      mockPetitionRepository.findOne.mockResolvedValue(mockPetition);
      (openai.createCompletion as jest.Mock).mockResolvedValue({
        data: {
          choices: [{ text: mockAnalysis }],
        },
      });

      const result = await service.analyzePetition('1');

      expect(result).toEqual({
        analysis: mockAnalysis,
        petition: mockPetition,
      });
    });
  });

  describe('getRecommendations', () => {
    it('should get personalized recommendations', async () => {
      const mockUser = {
        id: '1',
        votes: [
          { petition: { id: '1', category: 'ACADEMIC' } },
          { petition: { id: '2', category: 'FACILITY' } },
        ],
      };

      const mockRecommendations = 'Test recommendations';
      const mockPetitions = [
        { id: '3', title: 'Recommended Petition 1' },
        { id: '4', title: 'Recommended Petition 2' },
      ];

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (openai.createCompletion as jest.Mock).mockResolvedValue({
        data: {
          choices: [{ text: mockRecommendations }],
        },
      });
      mockPetitionRepository.getMany.mockResolvedValue(mockPetitions);

      const result = await service.getRecommendations('1');

      expect(result).toEqual({
        recommendations: mockRecommendations,
        petitions: mockPetitions,
      });
    });
  });

  describe('categorizePetition', () => {
    it('should categorize a petition', async () => {
      const mockPetition = {
        id: '1',
        title: 'Test Petition',
        content: 'Test Content',
      };

      const mockCategory = 'ACADEMIC';

      mockPetitionRepository.findOne.mockResolvedValue(mockPetition);
      (openai.createCompletion as jest.Mock).mockResolvedValue({
        data: {
          choices: [{ text: mockCategory }],
        },
      });
      mockPetitionRepository.save.mockResolvedValue({
        ...mockPetition,
        category: mockCategory,
      });

      const result = await service.categorizePetition('1');

      expect(result).toEqual({
        category: mockCategory,
        petition: { ...mockPetition, category: mockCategory },
      });
    });
  });

  describe('generateSummary', () => {
    it('should generate a summary', async () => {
      const mockPetition = {
        id: '1',
        title: 'Test Petition',
        content: 'Test Content',
      };

      const mockSummary = 'Test summary';

      mockPetitionRepository.findOne.mockResolvedValue(mockPetition);
      (openai.createCompletion as jest.Mock).mockResolvedValue({
        data: {
          choices: [{ text: mockSummary }],
        },
      });

      const result = await service.generateSummary('1');

      expect(result).toEqual({
        summary: mockSummary,
        petition: mockPetition,
      });
    });
  });
}); 