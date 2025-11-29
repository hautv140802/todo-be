import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableCamelCase1764423039155 implements MigrationInterface {
    name = 'UpdateUserTableCamelCase1764423039155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refresh_token" TO "refreshToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refreshToken" TO "refresh_token"`);
    }

}
