import { Column, Entity } from 'typeorm';

@Entity()
export class Task {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  progress: number;
}
