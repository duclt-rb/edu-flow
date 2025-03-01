import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  private supabase: SupabaseClient;

  constructor() {
    // this.supabase = createClient('your-supabase-url', 'your-supabase-key');
  }

  // async uploadFile(file: File): Promise<string> {
  //   const { data, error } = await this.supabase.storage
  //     .from('your-bucket-name')
  //     .upload(`public/${file.name}`, file);

  //   if (error) {
  //     throw new Error(`File upload failed: ${error.message}`);
  //   }

  //   const {
  //     data: { publicUrl },
  //   } = this.supabase.storage
  //     .from('your-bucket-name')
  //     .getPublicUrl(`public/${file.name}`);

  //   if (!publicUrl) {
  //     throw new Error(`Failed to get public URL: ${publicUrl}`);
  //   }

  //   return publicUrl;
  // }

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
}
