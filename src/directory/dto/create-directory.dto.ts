import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDirectoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(2)
  abbreviation: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;
}
