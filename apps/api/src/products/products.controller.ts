import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductsQueryDto } from './dto/list-products.query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('ping')
  ping() {
    return this.productsService.ping();
  }

@Get()
list(@Query() query: ListProductsQueryDto) {
  return this.productsService.list(query);
}


  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get(':id')
getById(@Param('id') id: string) {
  return this.productsService.getById(id);
}

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
  return this.productsService.update(id, dto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.productsService.softDelete(id);
}

}

