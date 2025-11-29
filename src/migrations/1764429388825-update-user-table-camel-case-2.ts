import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableCamelCase21764429388825 implements MigrationInterface {
    name = 'UpdateUserTableCamelCase21764429388825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refreshToken" TO "refresh_token"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refresh_token" TO "refreshToken"`);
    }

}
