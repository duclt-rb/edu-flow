import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { PermissionService } from '../permission.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class PermissionValidator implements ValidatorConstraintInterface {
  constructor(private readonly permissionService: PermissionService) {}

  async validate(permissionCodes: string[]) {
    if (isEmpty(permissionCodes)) {
      return true;
    }

    const isExist = await this.permissionService.exists(permissionCodes);
    return isExist;
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
