import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsUUID,
} from 'class-validator';
import { ProductStatus, ProductVisibility } from '../product.entity';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(220)
  slug?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  pricePaise?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  mrpPaise?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsEnum(ProductVisibility)
  visibility?: ProductVisibility;

  @IsOptional()
@IsUUID()
categoryId?: string | null;
}
