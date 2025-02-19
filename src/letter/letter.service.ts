import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { JwtUser } from 'src/auth/jwt.strategy';
import { User } from 'src/user/entities/user.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateLetterDto } from './dto/create-letter.dto';
import { GetLetterDto } from './dto/get-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { Letter } from './entities/letter.entity';

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
  ) {}

  async create(
    createLetterDto: CreateLetterDto,
    user: JwtUser,
  ): Promise<Letter> {
    const { relatedUserId, recipients, ...dto } = createLetterDto;

    const relatedUsers = await this.userRepository.find({
      where: { id: In(relatedUserId || []) },
    });

    const recipientUsers = await this.userRepository.find({
      where: { id: In(recipients || []) },
    });

    const letter = this.letterRepository.create(dto);
    letter.relatedUsers = relatedUsers;
    letter.recipients = recipientUsers;
    letter.senderId = user.id;

    return await this.letterRepository.save(letter);
  }

  async findAll(query: GetLetterDto) {
    const { page, limit, keyword, ...where } = query;
    const skip = Math.max(((page || 1) - 1) * (limit || 10), 0);
    const [result, count] = await this.letterRepository.findAndCount({
      relations: [
        'sendingFaculty',
        'receivingFaculty',
        'directory',
        'resolver',
        'relatedUsers',
        'recipients',
      ],
      select: selectColumn,
      take: limit || 10,
      skip,
      where: {
        ...where,
        ...(keyword ? { title: ILike(`%${keyword}%`) } : {}),
      },
    });

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
}
