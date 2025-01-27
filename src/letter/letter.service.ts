import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLetterDto } from './dto/create-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { Letter } from './entities/letter.entity';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
  ) {}

  async create(createLetterDto: CreateLetterDto): Promise<Letter> {
    const letter = this.letterRepository.create(createLetterDto);
    return await this.letterRepository.save(letter);
  }

  async findAll(): Promise<Letter[]> {
    return await this.letterRepository.find();
  }

  async findOne(id: string): Promise<Letter> {
    return await this.letterRepository.findOne({ where: { id } });
  }

  async update(id: string, updateLetterDto: UpdateLetterDto): Promise<Letter> {
    await this.letterRepository.update(id, updateLetterDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.letterRepository.delete(id);
  }
}
