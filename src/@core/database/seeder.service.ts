import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/role/entities/permission.entity';
import { RolePermission } from 'src/role/entities/role-permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import {
  adminRole,
  giangvienPermissions,
  permissionSeed,
  roleSeed,
  thutruongPermissions,
  vanthuPermissions,
} from './seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    this.logger.log('Seeding Role & Permission...');

    // Seed roles
    for (const role of roleSeed) {
      const roleExists = await this.roleRepository.findOne({
        where: { name: role },
      });

      if (!roleExists) {
        this.logger.log(`Insert Role => ${role}`);
        await this.roleRepository.save({ name: role });
      }
    }

    // Seed permissions
    for (const permission of permissionSeed) {
      const permissionExists = await this.permissionRepository.findOne({
        where: { code: permission.code },
      });

      if (!permissionExists) {
        this.logger.log(`Insert Permission => ${permission.code}`);
        await this.permissionRepository.save({
          code: permission.code,
          name: permission.name,
        });
      }
    }

    await this.seedRoleWithPermissions('Thủ Trưởng', thutruongPermissions);
    await this.seedRoleWithPermissions('Giảng Viên', giangvienPermissions);
    await this.seedRoleWithPermissions('Văn Thư', vanthuPermissions);

    const admin = await this.userRepository.findOne({
      where: {
        email: adminRole.email,
        roleId: IsNull(),
      },
    });

    if (admin) {
      const role = await this.roleRepository.findOne({
        where: { name: adminRole.role },
      });

      if (role) {
        this.logger.log(`Insert User & Role => ${admin.email} - ${role.name}`);
        this.userRepository.update(admin.id, { roleId: role.id });
      }
    }

    this.logger.log('Role & Permission seeding completed.');
  }

  private async seedRoleWithPermissions(
    roleName: string,
    permissions: string[],
  ) {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (role) {
      for (const permission of permissions) {
        const permissionExists = await this.rolePermissionRepository.findOne({
          where: { permission_id: permission, role_id: role.id },
        });

        if (!permissionExists) {
          this.logger.log(
            `Insert Role & Permission => ${role.name} - ${permission}`,
          );
          await this.rolePermissionRepository.save({
            permission_id: permission,
            role_id: role.id,
          });
        }
      }
    }
  }
}
