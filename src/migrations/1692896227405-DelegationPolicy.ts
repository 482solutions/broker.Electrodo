import { MigrationInterface, QueryRunner } from "typeorm";

export class DelegationPolicy1692896227405 implements MigrationInterface {
    name = 'DelegationPolicy1692896227405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "delegation_policy" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "policy_issuer" character varying NOT NULL, "access_subject" character varying NOT NULL, "policy" jsonb NOT NULL DEFAULT '"{}"', CONSTRAINT "PK_7e326a7c48b23171068252e6f2a" PRIMARY KEY ("policy_issuer", "access_subject"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "delegation_policy"`);
    }

}
