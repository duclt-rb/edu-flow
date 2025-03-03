import { Directory } from 'src/directory/entities/directory.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { File } from 'src/file/entities/file.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LetterRecipient } from './letter-recipient.entity';
import { Signature } from './signature.entity';
import { Task } from './task.entity';

@Entity()
export class Letter {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: string;

  @Column()
  key: string;

  @Column()
  title: string;

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

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ name: 'directory_id' })
  directoryId: string;

  @Column({ name: 'sending_faculty_id' })
  sendingFacultyId: string;

  @Column({ name: 'receiving_faculty_id' })
  receivingFacultyId: string;

  @Column({ name: 'resolver_id' })
  resolverId: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({
    type: 'enum',
    enum: [
      'awaiting_response',
      'no_reply',
      'awaiting_signature',
      'in_progress',
      'work_done',
      'awaiting_approval',
      'approved',
      'rejected',
      'overdue',
    ],
  })
  status: string;

  @ManyToOne(() => Directory, (directory) => directory.id)
  @JoinColumn({ name: 'directory_id' })
  directory: Directory;

  @OneToMany(() => LetterRecipient, (recipient) => recipient.letter)
  recipients: LetterRecipient[];

  @ManyToMany(() => User, (user) => user.relatedUsers)
  @JoinTable({
    name: 'letter_related_user',
    joinColumn: { name: 'letter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  relatedUsers: User[];

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'resolver_id' })
  resolver: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  @JoinColumn({ name: 'sending_faculty_id' })
  sendingFaculty: Faculty;

  @ManyToOne(() => Faculty, (faculty) => faculty.id)
  @JoinColumn({ name: 'receiving_faculty_id' })
  receivingFaculty: Faculty;

  @OneToMany(() => Signature, (signature) => signature.letter)
  signatures: Signature[];

  @OneToMany(() => Task, (task) => task.letter)
  tasks: Task[];

  @OneToMany(() => File, (file) => file.letter)
  @JoinColumn({ name: 'reply_id' })
  files: File[];
}
