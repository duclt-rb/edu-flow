import { Column, Entity } from 'typeorm';

@Entity()
export class File {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
