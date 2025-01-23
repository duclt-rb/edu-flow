import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';
import { PermissionExists } from '../validators/permission-validator';
import { UniqueRole } from '../validators/unique-role';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @UniqueRole()
  name: string;

  @IsArray()
  @PermissionExists()
  permissions: string[];
}
