import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Petition } from './petition.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  studentId?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @OneToMany(() => Petition, (petition: Petition) => petition.author)
  petitions: Petition[];

  @OneToMany(() => Vote, (vote: Vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Comment, (comment: Comment) => comment.user)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 