import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { JwtUser } from 'src/auth/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateLetterDto, LetterForm } from './dto/create-letter.dto';
import { GetLetterDto } from './dto/get-letter.dto';
import { SignLetterDto } from './dto/sign-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { Letter } from './entities/letter.entity';
import { Signature } from './entities/signature.entity';

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

    const recipientUsers = await this.userRepository.find({
      select: ['id', 'name', 'email'],
      where: { id: In(recipients || []) },
    });

    const sender = await this.userRepository.findOne({
      select: ['id', 'name', 'email'],
      where: { id: user.id },
    });

    const letter = this.letterRepository.create(dto);
    letter.relatedUsers = relatedUsers;
    letter.recipients = recipientUsers;
    letter.sender = sender;

    return await this.letterRepository.save(letter);
  }

  async findAll(query: GetLetterDto, user: JwtUser) {
    const { page, limit, keyword, form, ...where } = query;
    const skip = Math.max(((page || 1) - 1) * (limit || 10), 0);
    const queryBuilder = this.letterRepository
      .createQueryBuilder('letter')
      .leftJoinAndSelect('letter.sendingFaculty', 'sendingFaculty')
      .leftJoinAndSelect('letter.receivingFaculty', 'receivingFaculty')
      .leftJoinAndSelect('letter.directory', 'directory')
      .leftJoinAndSelect('letter.resolver', 'resolver')
      .leftJoinAndSelect('letter.relatedUsers', 'relatedUsers')
      .leftJoinAndSelect('letter.recipients', 'recipients')
      .leftJoinAndSelect('letter.sender', 'sender')
      .leftJoin('letter.signatures', 'signature')
      .leftJoin('signature.user', 'user')
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
        'recipients.id',
        'recipients.name',
        'recipients.email',
        'signature.status',
        'signature.description',
        'user.id',
        'user.name',
      ])
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
        'relatedUsers.id = :userId OR recipients.id = :userId OR (letter.form = :form AND sender.id = :userId)',
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
    return await this.letterRepository.findOne({
      where: { id },
      relations: [
        'sendingFaculty',
        'receivingFaculty',
        'directory',
        'resolver',
        'relatedUsers',
        'recipients',
        'sender',
      ],
      select: selectColumn,
    });
  }

  async update(id: string, updateLetterDto: UpdateLetterDto): Promise<Letter> {
    const { relatedUserId, recipients, ...dto } = updateLetterDto;

    if (!isEmpty(dto)) {
      await this.letterRepository.update(id, dto);
    }

    const letter = await this.letterRepository.findOneOrFail({
      where: { id },
      relations: ['relatedUsers', 'recipients'],
    });

    const relatedUsers = await this.userRepository.find({
      where: { id: In(relatedUserId || []) },
    });

    const recipientUsers = await this.userRepository.find({
      where: { id: In(recipients || []) },
    });

    letter.relatedUsers = relatedUsers;
    letter.recipients = recipientUsers;

    await this.letterRepository.save(letter);

    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.letterRepository.delete(id);

    return { success: result.affected > 0 };
  }

  async sign(id: string, dto: SignLetterDto, user: JwtUser) {
    const letter = await this.letterRepository.findOneOrFail({
      where: { id },
      relations: ['recipients'],
    });

    const recipient = letter.recipients.find(
      (recipient) => recipient.id === user.id,
    );

    if (!recipient) {
      throw new Error('Recipient not found');
    }

    const existedSign = await this.signatureRepository.findOne({
      relations: ['letter', 'user'],
      where: {
        letter: { id },
        user: { id: user.id },
      },
    });

    if (existedSign) {
      existedSign.status = dto.status;
      existedSign.description = dto.description || existedSign.description;
      return await this.signatureRepository.save(existedSign);
    } else {
      const sign = this.signatureRepository.create({
        letter,
        user,
        status: dto.status,
        description: dto.description,
      });

      return await this.signatureRepository.save(sign);
    }
  }
}
