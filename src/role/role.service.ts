import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from './entities/permission.entity';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.roleRepository.save({
      name: createRoleDto.name,
    });

    // Create role-permission relationships
    for (const permission of createRoleDto.permissions) {
      await this.rolePermissionRepository.save({
        role_id: role.id,
        permission_id: permission,
      });
    }

    return role;
  }

  async findAll() {
    return await this.roleRepository.find({
      relations: ['permissions'],
      select: {
        id: true,
        name: true,
        permissions: {
          code: true,
          name: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const result = await this.roleRepository.update(id, {
      name: updateRoleDto.name,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return await this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
