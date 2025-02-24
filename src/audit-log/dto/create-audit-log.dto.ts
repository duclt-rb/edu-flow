export class CreateAuditLogDto {
  user: string;
  action: string;
  target_id: string;
  target_type: string;
  created_at: Date;
}
