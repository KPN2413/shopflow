import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  slug!: string;

  @IsInt()
  @Min(1)
  pricePaise!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  mrpPaise?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
