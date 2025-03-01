import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { File } from 'buffer';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE,
    );

    this.supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .info('Logo xCorp_circle.svg')
      .then(console.log);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = process.env.SUPABASE_BUCKET_NAME;
    const filePath = `${Date.now()}-${file.originalname}`;
    const _file = new File([file.buffer], filePath, {
      type: file.mimetype,
    });

    const {
      data: { path },
      error,
    } = await this.supabase.storage.from(bucket).upload(filePath, _file);

    if (error) {
      throw new BadRequestException('Upload failed: ' + error.message);
    }

    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  async listFiles() {
    console.log(process.env.SUPABASE_BUCKET_NAME);
    const res = await this.supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .info('/Logo xCorp_circle.svg');

    console.log(res.error);

    console.log(res.data);

    return res.data;
  }
}
