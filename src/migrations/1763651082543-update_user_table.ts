import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1763651082543 implements MigrationInterface {
  name = 'UpdateUserTable1763651082543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "refresh_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
  }
}
