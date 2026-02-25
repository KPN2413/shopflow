import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductStockQty1772039131632 implements MigrationInterface {
  name = "AddProductStockQty1772039131632";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD COLUMN "stock_qty" integer NOT NULL DEFAULT 0`
    );

    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "CHK_products_stock_qty_nonneg" CHECK ("stock_qty" >= 0)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "CHK_products_stock_qty_nonneg"`
    );

    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock_qty"`);
  }
}