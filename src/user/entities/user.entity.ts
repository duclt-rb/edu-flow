import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @Column({ type: 'uuid', primary: true, generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @Column({ default: new Date(), type: 'timestamptz' })
  created_at: Date;

  @Column({ default: new Date(), type: 'timestamptz' })
  updated_at: Date;
}
