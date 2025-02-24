import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Letter } from './letter.entity';

@Entity()
export class Task {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @ManyToOne(() => Letter, (letter) => letter.tasks)
  @JoinColumn({ name: 'letter_id' })
  letter: Letter;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  description: string;

  @Column()
  feedback: string;

  @Column()
  status: string;

  @Column({ name: 'due_date' })
  dueDate: Date;
}
