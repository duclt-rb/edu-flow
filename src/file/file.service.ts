import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { File } from 'buffer';

@Injectable()
export class FileService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE,
    );
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
}
