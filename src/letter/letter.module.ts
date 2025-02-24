import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { LetterRecipient } from './entities/letter-recipient.entity';
import { Letter } from './entities/letter.entity';
import { Signature } from './entities/signature.entity';
import { Task } from './entities/task.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, Signature, Task, LetterRecipient]),
    UserModule,
  ],
  controllers: [LetterController],
  providers: [LetterService, JwtAuthGuard],
})
export class LetterModule {}
