import { AuditAction, EntityType } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  userId: string;
  action: AuditAction;
  entityId: string;
  entityType: EntityType;
}
