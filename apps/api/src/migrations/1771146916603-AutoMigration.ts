import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771146916603 implements MigrationInterface {
    name = 'AutoMigration1771146916603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_464f927ae360106b783ed0b4106"`);
    }

}
