import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Petition, PetitionStatus, PetitionCategory } from '../entities/petition.entity';
import { User } from '../entities/user.entity';
import { Vote, VoteType } from '../entities/vote.entity';
import { CreatePetitionDto } from './dto/create-petition.dto';
import { UpdatePetitionDto } from './dto/update-petition.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PetitionService {
  constructor(
    @InjectRepository(Petition)
    private readonly petitionRepository: Repository<Petition>,
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async create(createPetitionDto: CreatePetitionDto, userId: string): Promise<Petition> {
    const petition = this.petitionRepository.create({
      ...createPetitionDto,
      authorId: userId,
      status: PetitionStatus.PENDING,
      voteCount: 0,
    });
    return this.petitionRepository.save(petition);
  }

  async findAll(paginationDto: PaginationDto): Promise<[Petition[], number]> {
    const { page = 1, limit = 10 } = paginationDto;
    return this.petitionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['author', 'votes', 'comments'],
    });
  }

  async findOne(id: string): Promise<Petition> {
    const petition = await this.petitionRepository.findOne({
      where: { id },
      relations: ['author', 'votes', 'comments'],
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    return petition;
  }

  async update(id: string, updatePetitionDto: UpdatePetitionDto): Promise<Petition> {
    const petition = await this.findOne(id);
    Object.assign(petition, updatePetitionDto);
    return this.petitionRepository.save(petition);
  }

  async remove(id: string): Promise<void> {
    const result = await this.petitionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Petition not found');
    }
  }

  async search(
    keyword?: string,
    category?: PetitionCategory,
    status?: PetitionStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Petition[], number]> {
    const where: FindOptionsWhere<Petition> = {};

    if (keyword) {
      where['title'] = Like(`%${keyword}%`);
    }

    if (category) {
      where['category'] = category;
    }

    if (status) {
      where['status'] = status;
    }

    const [petitions, total] = await this.petitionRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['author', 'votes', 'comments'],
    });

    return [petitions, total];
  }

  async updateStatus(id: string, status: PetitionStatus): Promise<Petition> {
    const petition = await this.findOne(id);
    petition.status = status;
    return this.petitionRepository.save(petition);
  }

  async getPopular(limit: number = 10): Promise<Petition[]> {
    return this.petitionRepository.find({
      order: { voteCount: 'DESC' },
      take: limit,
      relations: ['author', 'votes', 'comments'],
    });
  }

  async getRecent(limit: number = 10): Promise<Petition[]> {
    return this.petitionRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['author', 'votes', 'comments'],
    });
  }

  async vote(id: string, userId: string, voteType: VoteType): Promise<Vote> {
    const petition = await this.findOne(id);

    if (petition.status !== PetitionStatus.ACTIVE) {
      throw new ForbiddenException('Cannot vote on non-active petitions');
    }

    let vote = await this.voteRepository.findOne({
      where: { petition: { id }, user: { id: userId } },
    });

    if (vote) {
      if (vote.type === voteType) {
        await this.voteRepository.remove(vote);
        return null;
      }
      vote.type = voteType;
    } else {
      vote = this.voteRepository.create({
        type: voteType,
        petition,
        user: { id: userId } as User,
      });
    }

    return this.voteRepository.save(vote);
  }
} 