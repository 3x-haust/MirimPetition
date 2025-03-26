import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Petition } from './petition.entity';

export enum VoteType {
  APPROVE = 'approve',
  REJECT = 'reject',
}

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: VoteType })
  type: VoteType;

  @Column()
  userId: string;

  @Column()
  petitionId: string;

  @ManyToOne(() => User, user => user.votes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Petition, petition => petition.votes)
  @JoinColumn({ name: 'petitionId' })
  petition: Petition;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 