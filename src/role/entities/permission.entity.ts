import { Column, Entity } from 'typeorm';

@Entity()
export class Permission {
  @Column({ primary: true })
  code: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: new Date(), type: 'timestamptz' })
  created_at: Date;

  @Column({ default: new Date(), type: 'timestamptz' })
  updated_at: Date;
}
