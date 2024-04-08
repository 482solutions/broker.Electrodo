import { MigrationInterface, QueryRunner } from "typeorm";

export class ReportUpdates1693499154649 implements MigrationInterface {
    name = 'ReportUpdates1693499154649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_report" DROP CONSTRAINT "UQ_5f0c1d76c542c4324b8d0596745"`);
        await queryRunner.query(`ALTER TABLE "public_report" DROP CONSTRAINT "UQ_73d9f1f5a6bb697a57776ea5486"`);
        await queryRunner.query(`ALTER TABLE "public_report" ADD CONSTRAINT "UQ_3b557f23e23665dff6cb725698a" UNIQUE ("organizationId", "year")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public_report" DROP CONSTRAINT "UQ_3b557f23e23665dff6cb725698a"`);
        await queryRunner.query(`ALTER TABLE "public_report" ADD CONSTRAINT "UQ_73d9f1f5a6bb697a57776ea5486" UNIQUE ("year")`);
        await queryRunner.query(`ALTER TABLE "public_report" ADD CONSTRAINT "UQ_5f0c1d76c542c4324b8d0596745" UNIQUE ("organizationId")`);
    }

}
