import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser, JwtAuthGuard, JwtUser } from 'src/auth/jwt.strategy';
import { CreateLetterDto } from './dto/create-letter.dto';
import { GetLetterDto } from './dto/get-letter.dto';
import { SignLetterDto } from './dto/sign-letter.dto';
import { UpdateLetterDto } from './dto/update-letter.dto';
import { LetterService } from './letter.service';

@Controller('letter')
@UseGuards(JwtAuthGuard)
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  create(
    @Body() createLetterDto: CreateLetterDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.letterService.create(createLetterDto, user);
  }

  @Get()
  findAll(@Query() query: GetLetterDto, @CurrentUser() user: JwtUser) {
    return this.letterService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.letterService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLetterDto: UpdateLetterDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.letterService.update(id, updateLetterDto, user);
  }

  @Post('sign/:id')
  sign(
    @Param('id') id: string,
    @Body() signLetterDto: SignLetterDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.letterService.sign(id, signLetterDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    return this.letterService.remove(id, user);
  }
}
