import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { Letter } from './entities/letter.entity';

const selectColumn = {
  id: true,
  key: true,
  title: true,
  type: true,
  form: true,
  archive: true,
  delete: true,
  description: true,
  createdAt: true,
  updatedAt: true,
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
  },
  resolver: {
    id: true,
    name: true,
  },
  dueDate: true,
  relatedUsers: {
    id: true,
    name: true,
    email: true,
  },
  status: true,
};

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLetterDto: CreateLetterDto): Promise<Letter> {
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

    return await this.letterRepository.save(letter);
  }

  async findAll(): Promise<Letter[]> {
    return await this.letterRepository.find({
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

  async findOne(id: string): Promise<Letter> {
    return await this.letterRepository.findOne({
      where: { id },
      select: selectColumn,
    });
  }

  async update(id: string, updateLetterDto: UpdateLetterDto): Promise<Letter> {
    const { relatedUserId, recipients, ...dto } = updateLetterDto;

    await this.letterRepository.update(id, dto);

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

  async remove(id: string): Promise<void> {
    await this.letterRepository.delete(id);
  }
}
