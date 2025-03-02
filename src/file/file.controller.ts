import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file')) // 'file' là field name của file trong form
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const publicUrl = await this.fileService.uploadFile(file);
    return { url: publicUrl };
  }

  @Get('/list-file')
  async listFiles() {}
}
