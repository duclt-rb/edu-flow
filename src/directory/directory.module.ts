import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectoryController } from './directory.controller';
import { DirectoryService } from './directory.service';
import { Directory } from './entities/directory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Directory])],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class DirectoryModule {}
