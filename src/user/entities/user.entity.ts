import { Column, Entity } from 'typeorm';

@Entity()
export class User {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: new Date(), type: 'timestamptz' })
  created_at: Date;

  @Column({ default: new Date(), type: 'timestamptz' })
  updated_at: Date;
}
