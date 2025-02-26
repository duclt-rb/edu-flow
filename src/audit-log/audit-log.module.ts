import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), NotificationModule],
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [TypeOrmModule, AuditLogService],
})
export class AuditLogModule {}
