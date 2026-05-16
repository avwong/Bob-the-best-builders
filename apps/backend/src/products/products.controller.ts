import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto, ProductWithAisleDto, PaginatedProductsDto } from './dto/product-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('supermarketId') supermarketId?: string,
  ): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(page, limit, supermarketId);
  }

  @Get('search')
  async search(
    @Query('name') name: string,
    @Query('supermarketId') supermarketId?: string,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.searchByName(name, supermarketId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductWithAisleDto> {
    return this.productsService.findOne(id);
  }

  @Get(':id/location')
  async getLocation(@Param('id') id: string): Promise<ProductWithAisleDto> {
    return this.productsService.getProductLocation(id);
  }
}

// Made with Bob
