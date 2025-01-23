import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { In, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class PermissionValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async validate(permissionCodes: string[]) {
    if (isEmpty(permissionCodes)) {
      return true;
    }

    const permissions = await this.permissionRepository.findBy({
      code: In(permissionCodes),
    });

    return isEmpty(permissions);
  }

  defaultMessage() {
    return 'Some permissions do not exist';
  }
}

export function PermissionExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PermissionValidator,
    });
  };
}
