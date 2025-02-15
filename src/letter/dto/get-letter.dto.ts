import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { LetterForm, LetterStatus, LetterType } from './create-letter.dto';

export class GetLetterDto {
  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsEnum(LetterType)
  @IsOptional()
  type: LetterType;

  @IsEnum(LetterForm)
  form: LetterForm;

  @IsString()
  @IsOptional()
  keyword: string;

  @IsEnum(LetterStatus)
  @IsOptional()
  status: LetterStatus;
}
