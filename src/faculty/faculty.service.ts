import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map, trim } from 'lodash';
import { In, IsNull, Repository } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty) private facultyRepository: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto) {
    const existingFaculty = await this.facultyRepository.findOne({
      where: { abbreviation: createFacultyDto.abbreviation },
    });

    if (existingFaculty) {
      throw new BadRequestException(
        'Faculty with this abbreviation already exists',
      );
    }

    return this.facultyRepository.save(createFacultyDto);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const query = this.facultyRepository
      .createQueryBuilder('faculty')
      .select([
        'faculty.id',
        'faculty.name',
        'faculty.abbreviation',
        'faculty.type',
      ]);

    if (search) {
      query.where(
        '(faculty.name LIKE :search OR faculty.abbreviation LIKE :search)',
        { search: `%${trim(search)}%` },
      );
    }

    query.andWhere({ parentId: IsNull() });

    query.skip(((page || 1) - 1) * (limit || 10)).take(limit || 10);

    const [result, total] = await query.getManyAndCount();

    const subQuery = await this.facultyRepository.find({
      where: { parentId: In(map(result, (r) => r.id)) },
      select: ['id', 'name', 'abbreviation', 'type', 'parentId'],
    });

    result.forEach((r) => {
      r.children = subQuery.filter((s) => s.parentId === r.id);
    });

    return {
      data: result,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const faculty = await this.facultyRepository.findOne({
      where: { id },
      select: ['id', 'name', 'abbreviation', 'type'],
    });

    if (!faculty) {
      throw new BadRequestException('Faculty not found');
    }

    const children = await this.facultyRepository.find({
      where: { parentId: id },
      select: ['id', 'name', 'abbreviation', 'type', 'parentId'],
    });

    faculty.children = children;

    return faculty;
  }

  async update(id: string, updateFacultyDto: UpdateFacultyDto) {
    const faculty = await this.facultyRepository.findOne({ where: { id } });

    if (!faculty) {
      throw new BadRequestException('Faculty not found');
    }

    await this.facultyRepository.update(id, updateFacultyDto);

    return this.facultyRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const faculty = await this.facultyRepository.findOne({ where: { id } });

    if (!faculty) {
      throw new BadRequestException('Faculty not found');
    }

    await this.facultyRepository.delete(id);

    return { message: 'Faculty removed successfully' };
  }
}
