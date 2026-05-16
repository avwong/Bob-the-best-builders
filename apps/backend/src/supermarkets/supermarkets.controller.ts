import { Controller, Get, Param } from '@nestjs/common';
import { SupermarketsService } from './supermarkets.service';
import { SupermarketResponseDto, SupermarketLayoutDto } from './dto/supermarket-response.dto';

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
}

// Made with Bob
