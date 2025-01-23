import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';
import { PermissionExists } from '../validators/permission-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsArray()
  @PermissionExists()
  permissions: string[];
}
