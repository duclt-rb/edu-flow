import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum FacultyType {
  Faculty = 'faculty',
  Department = 'department',
}

export class CreateFacultyDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(2)
  abbreviation: string;

  @IsEnum(FacultyType)
  type: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
