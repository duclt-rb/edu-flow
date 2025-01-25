import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateDirectoryDto } from './dto/create-directory.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { Directory } from './entities/directory.entity';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectRepository(Directory)
    private directoryRepository: Repository<Directory>,
  ) {}

  async create(createDirectoryDto: CreateDirectoryDto): Promise<Directory> {
    const directory = this.directoryRepository.create(createDirectoryDto);
    return await this.directoryRepository.save(directory);
  }

  async findAll(search: string, page: number, limit: number) {
    const [data, count] = await this.directoryRepository.findAndCount({
      where: { name: Like(`%${search}%`) },
      take: limit || 10,
      skip: ((page || 1) - 1) * (limit || 10),
      select: ['id', 'name', 'abbreviation', 'active'],
    });

    const totalPages = Math.ceil(count / (limit || 10));
    const currentPage = page || 1;

    return { data, count, currentPage, totalPages };
  }

  async findOne(id: string): Promise<Directory> {
    const directory = await this.directoryRepository.findOne({
      where: { id },
      select: ['id', 'name', 'abbreviation', 'active'],
    });

    if (!directory) {
      throw new BadRequestException('Directory not found');
    }

    return directory;
  }

  async update(
    id: string,
    updateDirectoryDto: UpdateDirectoryDto,
  ): Promise<Directory> {
    const directory = await this.findOne(id);
    if (!directory) {
      throw new BadRequestException('Directory not found');
    }
    await this.directoryRepository.update(id, updateDirectoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const directory = await this.findOne(id);
    if (!directory) {
      throw new BadRequestException('Directory not found');
    }
    await this.directoryRepository.delete(id);

    return { message: 'Directory deleted successfully' };
  }
}
