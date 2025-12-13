import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductImageTableAndProductTable1765388729989 implements MigrationInterface {
    name = 'UpdateProductImageTableAndProductTable1765388729989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "public_image_url" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_image" ADD "public_url" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_image" DROP COLUMN "public_url"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "public_image_url"`);
    }

}
