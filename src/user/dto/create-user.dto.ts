import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  roleId: string;

  @IsString()
  @IsOptional()
  facultyId: string;

  @IsString()
  @IsOptional()
  departmentId: string;
}
