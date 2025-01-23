import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueRoleValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async validate(name: string) {
    const isUnique = await this.roleRepository.findOneBy({ name });

    return !isUnique;
  }

  defaultMessage() {
    return 'The role already exists';
  }
}

export function UniqueRole(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueRoleValidator,
    });
  };
}
