import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { slugifyCategoryName } from './category.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim();
    const slug = slugifyCategoryName(name);

    const entity = this.repo.create({ name, slug });

    try {
      return await this.repo.save(entity);
    } catch (e: any) {
      // Postgres unique_violation
      if (e?.code === '23505') {
        throw new ConflictException('Category name/slug already exists');
      }
      throw e;
    }
  }

    async list(): Promise<Category[]> {
    return this.repo.find({
      order: { name: 'ASC' },
    });
  }

}
