import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from 'src/database/seeder.service';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { PermissionService } from './permission.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController],
  providers: [RoleService, SeederService, PermissionService],
  exports: [RoleService, SeederService, PermissionService],
})
export class RoleModule {}
