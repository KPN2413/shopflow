import { Body, Controller, Post, Get, Param, Patch, Delete } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Get()
  list() {
    return this.categoriesService.list();
  }
      @Get(':id')
  getById(@Param('id') id: string) {
    return this.categoriesService.getById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: import('./dto/update-category.dto').UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}


