import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
