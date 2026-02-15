import { Category } from '../categories/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
}

export enum ProductVisibility {
  HIDDEN = 'HIDDEN',
  PUBLIC = 'PUBLIC',
}

@Entity({ name: 'products' })
@Index('idx_products_status', ['status'])
@Index('idx_products_visibility', ['visibility'])
export class Product {
  @Index('idx_products_category_id', ['categoryId'])
  @Column({ type: 'uuid', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category | null;


  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Display name shown to users
  @Column({ type: 'varchar', length: 200 })
  name!: string;

  // URL-friendly unique identifier (unique constraint will be added in next micro-step)
  @Column({ type: 'varchar', length: 220, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  // Money is stored in integer paise (INR only). Example: ₹199.00 => 19900
  @Column({ type: 'int', name: 'price_paise' })
  pricePaise!: number;

  // Optional “MRP”/original price for discount display
  @Column({ type: 'int', name: 'mrp_paise', nullable: true })
  mrpPaise!: number | null;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status!: ProductStatus;

  @Column({
    type: 'enum',
    enum: ProductVisibility,
    default: ProductVisibility.HIDDEN,
  })
  visibility!: ProductVisibility;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Soft delete support (DELETE will not remove row permanently)
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;
}
