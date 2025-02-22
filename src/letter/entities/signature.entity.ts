import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Letter } from './letter.entity';

@Entity()
export class Signature {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @ManyToOne(() => Letter, (letter) => letter.signatures)
  @JoinColumn({ name: 'letter_id' })
  letter: Letter;

  @ManyToOne(() => User, (user) => user.signatures)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  description: string;

  @Column()
  status: string;
}
