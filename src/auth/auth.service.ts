import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(dto: LoginDto) {
    const { password, email } = dto;

    const user = await this.userService.findOneByEmail(email);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      // Implement your logic for successful login, e.g., generating a JWT token
      return { message: 'Login successful' };
    } else {
      throw new Error('Invalid credentials');
    }
  }
}
