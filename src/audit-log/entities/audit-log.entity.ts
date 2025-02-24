import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EntityType {
  LETTER = 'LETTER',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.auditLogs, { eager: true })
  user: User;

  @Column()
  action: AuditAction;

  @Column({ name: 'entity_id', nullable: true })
  entityId: string;

  @Column({ name: 'entity_type', type: 'enum', enum: EntityType })
  entityType: EntityType;

  @CreateDateColumn()
  created_at: Date;
}
