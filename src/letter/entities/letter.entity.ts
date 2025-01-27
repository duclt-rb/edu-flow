import { Directory } from 'src/directory/entities/directory.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Letter {
  @Column({ type: 'uuid', primary: true })
  id: string;

  @Column()
  key: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: [
      'draft',
      'awaiting_response',
      'no_reply',
      'awaiting_signature',
      'in_progress',
      'work_done',
      'awaiting_approval',
      'approved',
      'rejected',
    ],
  })
  status: string;

  @Column({ type: 'enum', enum: ['reply', 'noreply'] })
  type: string;

  @Column({ type: 'enum', enum: ['send', 'receive'] })
  form: string;

  @Column()
  description: string;

  @Column()
  archive: boolean;

  @Column()
  delete: boolean;

  @Column({ name: 'due_date', type: 'timestamptz' })
  dueDate: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ name: 'directory_id' })
  directoryId: string;

  @ManyToOne(() => Directory, (directory) => directory.id)
  directory: Directory;

  @Column({ name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @Column()
  recipient_id: string;

  @ManyToOne(() => User, (user) => user.id)
  recipient: User;

  @Column({ name: 'resolver_id' })
  resolver_id: string;

  @ManyToOne(() => User, (user) => user.id)
  resolver: User;

  @Column({ name: 'sending_unit_id' })
  sendingUnitId: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  sendingUnit: Faculty;

  @Column({ name: 'receiving_unit_id' })
  receivingUnitId: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  receivingUnit: Faculty;

  @Column({ name: 'related_unit_id' })
  relatedUnitId: string[];

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  relatedUnit: Faculty[];
}
