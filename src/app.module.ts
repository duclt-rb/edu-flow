import { MailerModule } from '@nestjs-modules/mailer';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './@core/database/seeder.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DirectoryModule } from './directory/directory.module';
import { FacultyModule } from './faculty/faculty.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailersend.net',
        port: 587,
        auth: {
          user: 'MS_lIE9zp@trial-vywj2lprxej47oqz.mlsender.net',
          pass: 'mssp.jlJOZII.k68zxl20nw9gj905.xfbvHZF',
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      schema: 'public',
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    RoleModule,
    FacultyModule,
    DirectoryModule,
    // LetterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'development' && false) {
      await this.seederService.seed();
    }
  }
}
