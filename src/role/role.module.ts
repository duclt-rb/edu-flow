import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from 'src/database/seeder.service';
import { User } from 'src/user/entities/user.entity';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';
import { PermissionService } from './permission.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PermissionValidator } from './validators/permission-validator';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission, User])],
  controllers: [RoleController],
  providers: [
    RoleService,
    PermissionService,
    SeederService,
    PermissionValidator,
  ],
  exports: [RoleService, PermissionService, SeederService],
})
export class RoleModule {}
