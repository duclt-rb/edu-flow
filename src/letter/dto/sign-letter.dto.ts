import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SignStatus {
  Reject = 'reject',
  Approve = 'approve',
}

export class SignLetterDto {
  @ApiProperty()
  @IsEnum(SignStatus)
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
}
