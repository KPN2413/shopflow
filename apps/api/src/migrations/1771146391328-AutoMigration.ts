import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771146391328 implements MigrationInterface {
    name = 'AutoMigration1771146391328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."products_status_enum" AS ENUM('DRAFT', 'ACTIVE')`);
        await queryRunner.query(`CREATE TYPE "public"."products_visibility_enum" AS ENUM('HIDDEN', 'PUBLIC')`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "slug" character varying(220) NOT NULL, "description" text, "price_paise" integer NOT NULL, "mrp_paise" integer, "status" "public"."products_status_enum" NOT NULL DEFAULT 'DRAFT', "visibility" "public"."products_visibility_enum" NOT NULL DEFAULT 'HIDDEN', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_products_visibility" ON "products" ("visibility") `);
        await queryRunner.query(`CREATE INDEX "idx_products_status" ON "products" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_products_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_products_visibility"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TYPE "public"."products_visibility_enum"`);
        await queryRunner.query(`DROP TYPE "public"."products_status_enum"`);
    }

}
    