import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_role' })
export class UserRole {
  // Add properties
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  role_id: string;

  @Column({ type: 'timestamptz', default: new Date() })
  created_at: Date;

  @Column({ type: 'timestamptz', default: new Date() })
  updated_at: Date;
}
