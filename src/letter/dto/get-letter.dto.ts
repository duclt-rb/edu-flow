import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { LetterForm, LetterStatus, LetterType } from './create-letter.dto';

export class GetLetterDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional()
  @IsEnum(LetterType)
  @IsOptional()
  type: LetterType;

  @ApiProperty()
  @IsEnum(LetterForm)
  form: LetterForm;

  @IsString()
  @IsOptional()
  keyword: string;

  @ApiPropertyOptional()
  @IsEnum(LetterStatus)
  @IsOptional()
  status: LetterStatus;
}
