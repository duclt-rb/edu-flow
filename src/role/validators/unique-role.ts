import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RoleService } from '../role.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueRoleValidator implements ValidatorConstraintInterface {
  constructor(private readonly roleService: RoleService) {}

  async validate(name: string) {
    const isUnique = await this.roleService.findByName(name);

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
