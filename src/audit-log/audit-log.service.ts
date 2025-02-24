import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from 'src/letter/entities/letter.entity';
import { Repository } from 'typeorm';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto) {
    const auditLog = this.auditLogRepository.create({
      ...createAuditLogDto,
      user: { id: createAuditLogDto.userId },
    });
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(limit = 10, page = 1) {
    const skip = (page - 1) * limit;
    const [result, count] = await this.auditLogRepository
      .createQueryBuilder('auditLog')
      .leftJoinAndSelect('auditLog.user', 'user')
      .leftJoinAndMapOne(
        'auditLog.entity',
        Letter,
        'letter',
        'letter.id = auditLog.entityId',
      )
      .select([
        'auditLog.id',
        'auditLog.action',
        'auditLog.entityType',
        'auditLog.entityId',
        'auditLog.createdAt',
        'user.id',
        'user.name',
        'user.email',
        'letter',
      ])
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      data: result,
      count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<AuditLog> {
    return this.auditLogRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.auditLogRepository.delete(id);
  }
}
