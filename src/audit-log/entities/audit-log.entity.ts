import { Notification } from 'src/notification/entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum EntityType {
  LETTER = 'LETTER',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  SIGN = 'SIGN',
}

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.auditLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  action: AuditAction;

  @Column({ name: 'entity_id', nullable: true })
  entityId: string;

  @Column({ name: 'entity_type', type: 'enum', enum: EntityType })
  entityType: EntityType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Notification, (notification) => notification.auditLog)
  notifications: Notification[];
}
