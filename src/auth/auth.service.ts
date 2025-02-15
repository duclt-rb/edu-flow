import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { map } from 'lodash';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { password, email } = dto;

    const user = await this.userService.findOneByEmail(email);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const payload = {
        avatar: user.avatar,
        name: user.name,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        email: user.email,
        sub: user.id,
        role: { id: user.role.id, name: user.role.name },
        permissions: map(
          user.role.permissions,
          (permission) => permission.code,
        ),
        faculty: user.faculty || [],
        department: user.department || [],
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
