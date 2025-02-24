import { Letter } from 'src/letter/entities/letter.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum NotificationType {
  NEW_LETTER = 'NEW_LETTER',
  UPDATED_LETTER = 'UPDATED_LETTER',
}

export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.notifications, { eager: true })
  user: User;

  @ManyToOne(() => Letter, { nullable: true, eager: true })
  letter: Letter | null;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @CreateDateColumn()
  created_at: Date;
}
