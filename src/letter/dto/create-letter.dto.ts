import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum LetterType {
  REPLY = 'reply',
  NOREPLY = 'noreply',
}

export enum LetterForm {
  SEND = 'send',
  RECEIVE = 'receive',
}

export enum LetterStatus {
  AWAITING_RESPONSE = 'awaiting_response',
  NO_REPLY = 'no_reply',
  AWAITING_SIGNATURE = 'awaiting_signature',
  IN_PROGRESS = 'in_progress',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class Recipients {
  @IsString()
  userId: string;

  @IsString()
  description: string;
}

export class LetterTask {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class CreateLetterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsEnum(LetterType)
  type: string;

  @ApiProperty()
  @IsEnum(LetterForm)
  form: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  archive: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  delete: boolean;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsString()
  directoryId: string;

  @ApiProperty()
  @IsString()
  resolverId: string;

  @ApiProperty()
  @IsString()
  sendingFacultyId: string;

  @ApiProperty()
  @IsString()
  receivingFacultyId: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  relatedUserId: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Recipients)
  recipients: Recipients[];

  @ApiProperty()
  @IsEnum(LetterStatus)
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsArray({})
  @ValidateNested({ each: true })
  @Type(() => LetterTask)
  @IsOptional()
  tasks: LetterTask[];
}
