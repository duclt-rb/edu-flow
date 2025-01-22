import { Column, Entity } from 'typeorm';

@Entity()
export class Role {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: new Date(), type: 'timestamptz' })
  created_at: Date;

  @Column({ default: new Date(), type: 'timestamptz' })
  updated_at: Date;
}
