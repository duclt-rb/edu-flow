import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateLetterDto } from './dto/create-letter.dto';
import { GetLetterDto } from './dto/get-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { LetterService } from './letter.service';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  create(@Body() createLetterDto: CreateLetterDto) {
    return this.letterService.create(createLetterDto);
  }

  @Get()
  findAll(@Query() query: GetLetterDto) {
    return this.letterService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.letterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLetterDto: UpdateLetterDto) {
    return this.letterService.update(id, updateLetterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.letterService.remove(id);
  }
}
