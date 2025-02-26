import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = v4();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      createUserDto.password || password,
      salt,
    );
    const user = { ...createUserDto, password: hashedPassword };

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    try {
      await this.mailerService.sendMail({
        to: createUserDto.email.replace(/\+[\d]+(?=@)/, ''),
        from: '"Letter Management" <xuannganle6868@gmail.com>',
        subject: 'Welcome to our platform',
        html: `
        <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div class="header" style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
                <h1>TDT-Letter Management</h1>
            </div>

            <div class="content" style="padding: 20px;">
                <h2>Hello ${createUserDto.name},</h2>
                <p>
                    Bạn đã được mời tham gia hệ thống Letter Management của chúng tôi. Đây là
                    hệ thống giúp bạn quản lý công văn một cách hiệu quả và tiện lợi.
                </p>
                <p>
                    Vui lòng nhấn vào đường link bên dưới để truy cập hệ thống và đăng nhập
                    bằng tài khoản của bạn:
                </p>
                <p>Mật khẩu: ${createUserDto.password || password}</p>
                <p style="text-align: center;">
                    <a
                        target="_blank"
                        href="https://official-letter-management.vercel.app/dang-nhap"
                        class="button"
                        style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;"
                        >Chọn vào đây để đăng nhập</a
                    >
                </p>
            </div>
        </div>
      `,
      });
    } catch {
      throw new BadRequestException('Failed to send email');
    }

    return this.userRepository.save(user);
  }

  async findAll(page: number, limit: number) {
    const skip = Math.max(((page || 1) - 1) * (limit || 10), 0);
    const [result, total] = await this.userRepository.findAndCount({
      skip,
      take: limit || 10,
      relations: ['role', 'faculty', 'department'],
      select: {
        id: true,
        name: true,
        active: true,
        email: true,
        phone: true,
        role: {
          id: true,
          name: true,
        },
        faculty: {
          id: true,
          name: true,
        },
        department: {
          id: true,
          name: true,
        },
      },
    });

    return {
      data: result,
      count: total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'faculty', 'department'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.remove(user);
    return { message: `User with id ${id} has been removed` };
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions', 'faculty', 'department'],
    });
  }
}
