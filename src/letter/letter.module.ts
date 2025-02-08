import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Letter } from './entities/letter.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Letter]), UserModule],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
