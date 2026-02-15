import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus, ProductVisibility } from '../product.entity';

export class ListProductsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsEnum(ProductVisibility)
  visibility?: ProductVisibility;

  @IsOptional()
  @IsString()
  q?: string;

  // basic sort support
  @IsOptional()
  @IsString()
  sort?: 'createdAt' | 'pricePaise' = 'createdAt';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'DESC';
}
