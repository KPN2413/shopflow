import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './product.entity';
import { ListProductsQueryDto } from './dto/list-products.query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async ping(): Promise<{ ok: true }> {
    return { ok: true };
  }

  async create(input: {
    name: string;
    slug: string;
    pricePaise: number;
    mrpPaise?: number | null;
    description?: string | null;
  }): Promise<Product> {
    const product = this.productsRepo.create({
      name: input.name,
      slug: input.slug,
      pricePaise: input.pricePaise,
      mrpPaise: input.mrpPaise ?? null,
      description: input.description ?? null,
    });

    try {
      return await this.productsRepo.save(product);
    } catch (err) {
      // Postgres unique violation: 23505
      if (
        err instanceof QueryFailedError &&
        typeof (err as any).driverError?.code === 'string' &&
        (err as any).driverError.code === '23505'
      ) {
        throw new ConflictException('Product slug already exists');
      }
      throw err;
    }
  }

  async list(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.productsRepo.createQueryBuilder('p');

    if (query.status) qb.andWhere('p.status = :status', { status: query.status });

    if (query.visibility) {
      qb.andWhere('p.visibility = :visibility', { visibility: query.visibility });
    }

    if (query.q && query.q.trim().length > 0) {
      const q = `%${query.q.trim().toLowerCase()}%`;
      qb.andWhere('(LOWER(p.name) LIKE :q OR LOWER(p.slug) LIKE :q)', { q });
    }


    

    const sortField =
      query.sort === 'pricePaise' ? 'p.pricePaise' : 'p.createdAt';

    const sortOrder = query.order === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(sortField, sortOrder).skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async getById(id: string): Promise<Product> {
  const product = await this.productsRepo.findOne({ where: { id } });
  if (!product) throw new NotFoundException('Product not found');
  return product;
}

async update(id: string, dto: UpdateProductDto): Promise<Product> {
  const product = await this.productsRepo.findOne({ where: { id } });
  if (!product) throw new NotFoundException('Product not found');

  // Apply only provided fields
  if (dto.name !== undefined) product.name = dto.name;
  if (dto.slug !== undefined) product.slug = dto.slug;
  if (dto.pricePaise !== undefined) product.pricePaise = dto.pricePaise;
  if (dto.mrpPaise !== undefined) product.mrpPaise = dto.mrpPaise ?? null;
  if (dto.description !== undefined) product.description = dto.description ?? null;
  if (dto.status !== undefined) product.status = dto.status;
  if (dto.visibility !== undefined) product.visibility = dto.visibility;

  try {
    return await this.productsRepo.save(product);
  } catch (err) {
    if (
      err instanceof QueryFailedError &&
      typeof (err as any).driverError?.code === 'string' &&
      (err as any).driverError.code === '23505'
    ) {
      throw new ConflictException('Product slug already exists');
    }
    throw err;
  }
}

async softDelete(id: string): Promise<{ ok: true }> {
  const res = await this.productsRepo.softDelete({ id });
  if (!res.affected || res.affected < 1) {
    throw new NotFoundException('Product not found');
  }
  return { ok: true };
}


}
