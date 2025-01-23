import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll() {
    return await this.permissionRepository.find();
  }

  async exists(permissionCodes: string[]) {
    const permissions = await this.permissionRepository.findBy({
      code: In(permissionCodes),
    });

    return isEmpty(permissions);
  }
}
