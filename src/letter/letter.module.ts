import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { DirectoryModule } from 'src/directory/directory.module';
import { FacultyModule } from 'src/faculty/faculty.module';
import { FileModule } from 'src/file/file.module';
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
    DirectoryModule,
    FacultyModule,
    AuditLogModule,
    FileModule,
  ],
  controllers: [LetterController],
  providers: [LetterService, JwtAuthGuard],
})
export class LetterModule {}
