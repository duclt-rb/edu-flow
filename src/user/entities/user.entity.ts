import { AuditLog } from 'src/audit-log/entities/audit-log.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Letter } from 'src/letter/entities/letter.entity';
import { Signature } from 'src/letter/entities/signature.entity';
import { Task } from 'src/letter/entities/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Notification } from '../../notification/entities/notification.entity';
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

  @Column({ type: 'uuid', name: 'faculty_id' })
  facultyId: string;

  @Column({ type: 'uuid', name: 'department_id' })
  departmentId: string;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  @JoinColumn({ name: 'faculty_id', referencedColumnName: 'id' })
  faculty: Faculty;

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  department: Faculty;

  @Column({ default: new Date(), type: 'timestamptz' })
  created_at: Date;

  @Column({ default: new Date(), type: 'timestamptz' })
  updated_at: Date;

  @ManyToMany(() => Letter, (letter) => letter.relatedUsers)
  relatedUsers: Letter[];

  @ManyToMany(() => Letter, (letter) => letter.recipients)
  recipientUsers: Letter[];

  @OneToMany(() => Signature, (signature) => signature.user)
  signatures: Signature[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Task, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  @OneToMany(() => Task, (notification) => notification.user)
  notifications: Notification[];
}
