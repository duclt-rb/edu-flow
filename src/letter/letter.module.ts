import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { Letter } from './entities/letter.entity';
import { Signature } from './entities/signature.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Letter, Signature]), UserModule],
  controllers: [LetterController],
  providers: [LetterService, JwtAuthGuard],
})
export class LetterModule {}
