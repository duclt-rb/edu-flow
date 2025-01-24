import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from '../database/seeder.service';
import { User } from '../user/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { PermissionService } from './permission.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PermissionValidator } from './validators/permission-validator';
import { UniqueRoleValidator } from './validators/unique-role';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission, User])],
  controllers: [RoleController],
  providers: [
    PermissionValidator,
    UniqueRoleValidator,
    RoleService,
    PermissionService,
    SeederService,
  ],
  exports: [RoleService, PermissionService, SeederService, TypeOrmModule],
})
export class RoleModule {}
