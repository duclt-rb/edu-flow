import { Letter } from 'src/letter/entities/letter.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => Letter, (letter) => letter.files)
  @JoinColumn({ name: 'letter_id' })
  letter: Letter;
}
