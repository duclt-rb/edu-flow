import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/role/entities/permission.entity';
import { Role } from 'src/role/entities/role.entity';
import { Repository } from 'typeorm';
import { permissionSeed, roleSeed } from './seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
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

    this.logger.log('Role & Permission seeding completed.');
  }
}
