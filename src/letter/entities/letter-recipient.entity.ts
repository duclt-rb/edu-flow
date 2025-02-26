import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Letter } from './letter.entity';

@Entity('letter_recipient_user')
export class LetterRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.recipients, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Letter, (letter) => letter.recipients)
  @JoinColumn({ name: 'letter_id' })
  letter: Letter;

  @Column()
  description: string;

  @Column()
  order: number;
}
