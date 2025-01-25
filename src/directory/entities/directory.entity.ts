import { Column, Entity } from 'typeorm';

@Entity()
export class Directory {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  abbreviation: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
