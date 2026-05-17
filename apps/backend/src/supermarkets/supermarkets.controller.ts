import { Body, Controller, Get, Param, Put, ValidationPipe } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketResponseDto, SupermarketLayoutDto } from './dto/supermarket-response.dto';
import { SaveSupermarketLayoutDto } from './dto/save-layout.dto';

@Controller('supermarkets')
export class SupermarketsController {
  constructor(private readonly supermarketsService: SupermarketsService) {}

  @Get()
  async findAll(): Promise<SupermarketResponseDto[]> {
    return this.supermarketsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SupermarketResponseDto> {
    return this.supermarketsService.findOne(id);
  }

  @Get(':id/layout')
  async getLayout(@Param('id') id: string): Promise<SupermarketLayoutDto> {
    return this.supermarketsService.getLayout(id);
  }

  @Put(':id/layout')
  async saveLayout(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    layout: SaveSupermarketLayoutDto,
  ): Promise<SupermarketLayoutDto> {
    return this.supermarketsService.saveLayout(id, layout);
  }
}

// Made with Bob
