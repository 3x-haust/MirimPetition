import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';

export enum PetitionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum PetitionCategory {
  ACADEMIC = 'academic',
  FACILITY = 'facility',
  WELFARE = 'welfare',
  EVENT = 'event',
  OTHER = 'other',
}

@Entity('petitions')
export class Petition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PetitionStatus,
    default: PetitionStatus.PENDING,
  })
  status: PetitionStatus;

  @Column({
    type: 'enum',
    enum: PetitionCategory,
  })
  category: PetitionCategory;

  @Column({ default: 0 })
  voteCount: number;

  @Column({ nullable: true })
  officialResponse?: string;

  @Column({ nullable: true })
  responseDate?: Date;

  @ManyToOne(() => User, (user: User) => user.petitions)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @OneToMany(() => Vote, (vote: Vote) => vote.petition)
  votes: Vote[];

  @OneToMany(() => Comment, (comment: Comment) => comment.petition)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 