import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User, UserRole } from '../entities/user.entity';
import { Petition, PetitionStatus } from '../entities/petition.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Petition)
    private petitionRepository: Repository<Petition>,
  ) {}

  async create(createCommentDto: {
    content: string;
    petitionId: string;
    user: User;
  }): Promise<Comment> {
    const petition = await this.petitionRepository.findOne({
      where: { id: createCommentDto.petitionId },
    });

    if (!petition) {
      throw new NotFoundException('Petition not found');
    }

    // Only admin and teacher can comment on closed petitions
    if (petition.status === PetitionStatus.CLOSED) {
      if (createCommentDto.user.role !== UserRole.ADMIN && createCommentDto.user.role !== UserRole.TEACHER) {
        throw new ForbiddenException('Cannot comment on closed petitions');
      }
    }

    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      petition,
      user: createCommentDto.user,
    });

    return this.commentRepository.save(comment);
  }

  async findAll(petitionId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { petition: { id: petitionId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'petition'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: { content: string }, user: User): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Cannot update other users comments');
    }

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.user.id !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Cannot delete other users comments');
    }

    await this.commentRepository.remove(comment);
  }
} 