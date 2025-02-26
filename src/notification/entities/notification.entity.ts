import { AuditLog } from 'src/audit-log/entities/audit-log.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => AuditLog, (auditLog) => auditLog.notifications, {
    eager: true,
  })
  @JoinColumn({ name: 'audit_log_id' })
  auditLog: AuditLog;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @CreateDateColumn()
  created_at: Date;
}
