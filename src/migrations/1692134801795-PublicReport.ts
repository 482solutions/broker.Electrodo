import { MigrationInterface, QueryRunner } from "typeorm";

export class PublicReport1692134801795 implements MigrationInterface {
    name = 'PublicReport1692134801795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public_report" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "organizationId" character varying NOT NULL, "year" integer NOT NULL, "report" jsonb NOT NULL DEFAULT '"{}"', CONSTRAINT "UQ_5f0c1d76c542c4324b8d0596745" UNIQUE ("organizationId"), CONSTRAINT "UQ_73d9f1f5a6bb697a57776ea5486" UNIQUE ("year"), CONSTRAINT "PK_1af82de239cf99a5ba1f66a4660" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "public_report"`);
    }

}
