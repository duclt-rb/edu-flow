import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty, uniqBy } from 'lodash';
import moment from 'moment';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import {
  AuditAction,
  AuditLog,
  EntityType,
} from 'src/audit-log/entities/audit-log.entity';
import { JwtUser } from 'src/auth/jwt.strategy';
import { Directory } from 'src/directory/entities/directory.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateLetterDto, LetterForm } from './dto/create-letter.dto';
import { GetLetterDto } from './dto/get-letter.dto';
import { SignLetterDto } from './dto/sign-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { LetterRecipient } from './entities/letter-recipient.entity';
import { Letter } from './entities/letter.entity';
import { Signature } from './entities/signature.entity';
import { Task } from './entities/task.entity';

const selectColumn = {
  id: true,
  key: true,
  title: true,
  type: true,
  form: true,
  description: true,
  status: true,
  directory: {
    id: true,
    name: true,
  },
  sendingFaculty: {
    id: true,
    name: true,
  },
  receivingFaculty: {
    id: true,
    name: true,
  },
  recipients: {
    id: true,
    name: true,
    email: true,
  },
  resolver: {
    id: true,
    name: true,
    email: true,
  },
  dueDate: true,
  relatedUsers: {
    id: true,
    name: true,
    email: true,
  },
  sender: {
    id: true,
    name: true,
    email: true,
  },
  archive: true,
  delete: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Signature)
    private readonly signatureRepository: Repository<Signature>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(LetterRecipient)
    private readonly recipientRepository: Repository<LetterRecipient>,

    @InjectRepository(Directory)
    private readonly directoryRepository: Repository<Directory>,

    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,

    private readonly auditService: AuditLogService,
    private readonly mailerService: MailerService,
  ) {}

  async create(
    createLetterDto: CreateLetterDto,
    user: JwtUser,
  ): Promise<Letter> {
    const { relatedUserId, recipients, ...dto } = createLetterDto;

    const relatedUsers = await this.userRepository.find({
      select: ['id', 'name', 'email'],
      where: { id: In(relatedUserId || []) },
    });

    const users = await this.userRepository.find({
      select: ['id', 'name', 'email'],
      where: { id: In(recipients?.map((e) => e.userId) || []) },
    });

    const sender = await this.userRepository.findOne({
      select: ['id', 'name', 'email'],
      where: { id: user.id },
    });

    const letter = this.letterRepository.create(dto);
    letter.relatedUsers = relatedUsers;
    letter.sender = sender;

    const result = await this.letterRepository.save(letter);

    if (!dto.key) {
      const directory = await this.directoryRepository.findOneOrFail({
        where: { id: dto.directoryId },
      });

      const faculty = await this.facultyRepository.findOneOrFail({
        where: { id: dto.sendingFacultyId },
      });

      result.key = `${result.id}/${new Date().getFullYear()}/${directory.abbreviation}-${faculty.abbreviation}`;
      await this.letterRepository.save(result);
    }

    const recipientMap = users.map((recipient) => ({
      letter: { id: result.id },
      user: recipient,
      description: recipients.find((e) => e.userId === recipient.id)
        ?.description,
    }));

    await this.recipientRepository.insert(recipientMap);

    const log = await this.auditService.create({
      action: AuditAction.CREATE,
      entityId: result.id,
      userId: user.id,
      entityType: EntityType.LETTER,
    });

    const email = [
      ...recipientMap.map((e) => ({
        name: e.user.name,
        email: e.user.email.replace(/\+[\d]+(?=@)/, ''),
      })),
      ...relatedUsers.map((e) => ({
        name: e.name,
        email: e.email.replace(/\+[\d]+(?=@)/, ''),
      })),
    ];

    this.sendNotification(email, log, user, letter);

    return this.findOne(result.id);
  }

  sendNotification(
    email: {
      name: string;
      email: string;
    }[],
    log: AuditLog,
    user: JwtUser,
    letter: Letter,
  ) {
    try {
      const _email = uniqBy(email, 'email.email');

      _email.forEach(async (e) => {
        await this.mailerService.sendMail({
          to: e.email,
          from: '"Letter Management" <xuannganle6868@gmail.com>',
          subject: 'TDT-Letter Thông Báo Cập Nhật',
          html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
                <h1>TDT-Letter Thông Báo Cập Nhật</h1>
            </div>
  
            <div style="padding: 20px;">
                <h2>Hello ${e.email},</h2>
                <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
                    <h3>Chi tiết công văn</h3>
                    <p><strong>Công văn ID: ${letter.id}</strong></p>
                    <p><strong>Tên công văn: ${letter.title}</strong></p>
                </div>
  
                <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Chi tiết cập nhật</h3>
                    <p><strong>Loại cập nhật: ${log.action}</strong></p>
  
                    <div style="color: #666; font-size: 0.9em; margin-top: 10px;">
                        <p>Cập nhật bởi: ${user.name}</p>
                        <p>Cập nhật vào: ${moment(log.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                    </div>
                </div>
  
                <p style="text-align: center;"></p>
                    <a href="https://official-letter-management.vercel.app/" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Xem chi tiết thông báo</a>
                </p>
                </div>
            </div>
            `,
        });
      });
    } catch {
      throw new BadRequestException('Failed to send email');
    }
  }

  letterFind() {
    return this.letterRepository
      .createQueryBuilder('letter')
      .leftJoinAndSelect('letter.sendingFaculty', 'sendingFaculty')
      .leftJoinAndSelect('letter.receivingFaculty', 'receivingFaculty')
      .leftJoinAndSelect('letter.directory', 'directory')
      .leftJoinAndSelect('letter.resolver', 'resolver')
      .leftJoinAndSelect('letter.relatedUsers', 'relatedUsers')
      .leftJoinAndSelect('letter.recipients', 'recipients')
      .leftJoinAndSelect('recipients.user', 'recipientUser')
      .leftJoinAndSelect('letter.sender', 'sender')
      .leftJoin('letter.tasks', 'tasks')
      .leftJoin('letter.signatures', 'signatures')
      .leftJoin('signatures.user', 'signatureUser')
      .leftJoin('tasks.user', 'taskUser')
      .select([
        'letter.id',
        'letter.key',
        'letter.title',
        'letter.type',
        'letter.form',
        'letter.description',
        'letter.status',
        'letter.dueDate',
        'letter.archive',
        'letter.delete',
        'letter.createdAt',
        'letter.updatedAt',
        'sendingFaculty.id',
        'sendingFaculty.name',
        'receivingFaculty.id',
        'receivingFaculty.name',
        'directory.id',
        'directory.name',
        'resolver.id',
        'resolver.name',
        'resolver.email',
        'sender.id',
        'sender.name',
        'sender.email',
        'relatedUsers.id',
        'relatedUsers.name',
        'relatedUsers.email',
        'recipients',
        'recipientUser.id',
        'recipientUser.name',
        'recipientUser.email',
        'signatures.status',
        'signatures.description',
        'signatureUser.id',
        'signatureUser.name',
        'tasks',
        'taskUser.id',
        'taskUser.name',
      ]);
  }

  async findAll(query: GetLetterDto, user: JwtUser) {
    const { page, limit, keyword, form, ...where } = query;
    const skip = Math.max(((page || 1) - 1) * (limit || 10), 0);
    const queryBuilder = this.letterFind()
      .take(limit || 10)
      .skip(skip);

    if (keyword) {
      queryBuilder.where('letter.title ILIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (form === LetterForm.SEND) {
      queryBuilder.andWhere(
        'letter.form = :form AND (resolver.id = :userId OR sender.id = :userId)',
        {
          form,
          userId: user.id,
        },
      );
    }

    if (form === LetterForm.RECEIVE) {
      queryBuilder.andWhere(
        'relatedUsers.id = :userId OR recipientUser.id = :userId OR (letter.form = :form AND sender.id = :userId)',
        {
          form,
          userId: user.id,
        },
      );
    }

    const [result, count] = await queryBuilder.getManyAndCount();

    return {
      data: result,
      count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Letter> {
    const query = this.letterFind().where('letter.id = :id', { id });
    const result = await query.getOne();

    return result;
  }

  async update(id: string, updateLetterDto: UpdateLetterDto, user: JwtUser) {
    const { relatedUserId, recipients, tasks, signatures, ...dto } =
      updateLetterDto;

    if (!isEmpty(dto)) {
      await this.letterRepository.update(id, dto);
    }

    if (!isEmpty(tasks)) {
      const taskIds = tasks.map((e) => e.id).filter((e) => e);

      await this.taskRepository.delete({
        letter: { id },
        id: Not(In(taskIds)),
      });

      const newTasks = tasks.map((task) => ({
        ...task,
        letter: { id },
        user: { id: task.userId },
      }));

      await this.taskRepository.upsert(newTasks, ['id']);
    }

    const letter = await this.letterRepository.findOneOrFail({
      where: { id },
      relations: ['relatedUsers', 'recipients', 'tasks'],
    });

    let relatedUsers = [],
      recipientUsers = [];

    if (!isEmpty(relatedUserId)) {
      relatedUsers = await this.userRepository.find({
        where: { id: In(relatedUserId || []) },
      });

      letter.relatedUsers = relatedUsers;
    }

    await this.letterRepository.save(letter);

    if (!isEmpty(recipients)) {
      const userIds = recipients.map((e) => e.userId);

      const affected = await this.recipientRepository.delete({
        letter: { id },
      });

      recipientUsers = await this.userRepository.find({
        where: { id: In(userIds || []) },
      });

      const recipientMap = recipientUsers.map((recipient) => ({
        letter: { id },
        user: recipient,
        description: recipients.find((e) => e.userId === recipient.id)
          ?.description,
      }));

      await this.recipientRepository.save(recipientMap);
    }

    const log = await this.auditService.create({
      action: AuditAction.UPDATE,
      entityId: id,
      userId: user.id,
      entityType: EntityType.LETTER,
    });

    const email = [
      ...letter.relatedUsers.map((e) => ({
        name: e.name,
        email: e.email.replace(/\+[\d]+(?=@)/, ''),
      })),
      ...letter.recipients.map((e) => ({
        name: e.user.name,
        email: e.user.email.replace(/\+[\d]+(?=@)/, ''),
      })),
    ];

    this.sendNotification(email, log, user, letter);

    return this.findOne(id);
  }

  async remove(id: string, user: JwtUser) {
    const result = await this.letterRepository.delete(id);

    const isTrue = result.affected > 0;

    if (isTrue) {
      await this.auditService.create({
        action: AuditAction.DELETE,
        entityId: id,
        userId: user.id,
        entityType: EntityType.LETTER,
      });
    }

    return { success: isTrue };
  }

  async sign(id: string, dto: SignLetterDto, user: JwtUser) {
    if (dto.clear) {
      await this.signatureRepository.delete({
        letter: { id },
      });

      return { success: true };
    }

    const letter = await this.letterRepository.findOneOrFail({
      where: { id },
      relations: ['recipients', 'relatedUsers'],
    });

    const recipient = letter.recipients.find(
      (recipient) => recipient.user.id === user.id,
    );

    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    const existedSign = await this.signatureRepository.findOne({
      relations: ['letter', 'user'],
      where: {
        letter: { id },
        user: { id: user.id },
      },
    });

    let result;
    if (existedSign) {
      existedSign.status = dto.status;
      existedSign.description = dto.description || existedSign.description;
      result = await this.signatureRepository.save(existedSign);
    } else {
      const sign = this.signatureRepository.create({
        letter,
        user,
        status: dto.status,
        description: dto.description,
      });

      result = await this.signatureRepository.save(sign);
    }

    const log = await this.auditService.create({
      action: AuditAction.SIGN,
      entityId: id,
      userId: user.id,
      entityType: EntityType.LETTER,
    });

    const email = [
      ...letter.recipients.map((e) => ({
        name: e.user.name,
        email: e.user.email.replace(/\+[\d]+(?=@)/, ''),
      })),
      ...letter.relatedUsers.map((e) => ({
        name: e.name,
        email: e.email.replace(/\+[\d]+(?=@)/, ''),
      })),
    ];

    this.sendNotification(email, log, user, letter);

    return result;
  }
}
