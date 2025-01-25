import { Column, Entity } from 'typeorm';

@Entity()
export class Faculty {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column()
  name: string;

  @Column()
  abbreviation: string;

  @Column({ type: 'enum', enum: ['faculty', 'department'] })
  type: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  children: Faculty[];
}
