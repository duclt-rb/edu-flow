import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum LetterType {
  REPLY = 'reply',
  NOREPLY = 'noreply',
}

export enum LetterForm {
  SEND = 'send',
  RECEIVE = 'receive',
}

export class CreateLetterDto {
  @IsString()
  @IsOptional()
  key: string;

  @IsString()
  title: string;

  @IsEnum(LetterType)
  type: string;

  @IsEnum(LetterForm)
  form: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  archive: boolean;

  @IsBoolean()
  @IsOptional()
  delete: boolean;

  @IsDateString()
  dueDate: Date;

  @IsString()
  directoryId: string;

  @IsString()
  resolverId: string;

  @IsString()
  sendingFacultyId: string;

  @IsString()
  receivingFacultyId: string;

  @IsArray()
  @IsOptional()
  relatedUserId: string[];

  @IsArray()
  @IsOptional()
  recipients: string[];

  @IsEnum(['draft'])
  @IsOptional()
  status: string;
}
