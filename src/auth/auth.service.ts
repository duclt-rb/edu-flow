import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
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
      const payload = { email: user.email, sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
