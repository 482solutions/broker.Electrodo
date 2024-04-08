import { MigrationInterface, QueryRunner } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

const newPolicies = [
    {
        policy_issuer: 'EU.EORI.UA482SOL',
        access_subject: process.env.ACCESS_SUBJECT_1,
        policy: {
            delegationEvidence: {
                notBefore: 1684843795,
                notOnOrAfter: 1799298267,
                policyIssuer: 'EU.EORI.UA482SOL',
                target: { accessSubject: process.env.ACCESS_SUBJECT_1 },
                policySets: [
                    {
                        target: { environment: { licenses: ['ISHARE.0002'] } },
                        policies: [
                            {
                                target: {
                                    resource: {
                                        type: 'EnergyConsumption',
                                        identifiers: [
                                            'urn:ngsi-ld:EnergyConsumption:private1693387872862x9981154737153638002023',
                                        ],
                                        attributes: ['*'],
                                    },
                                    actions: ['GET', 'POST', 'PATCH'],
                                },
                                rules: [{ effect: 'Permit' }],
                            },
                        ],
                    },
                ],
            },
        },
    },
    {
        policy_issuer: 'EU.EORI.UA482SOL',
        access_subject: process.env.ACCESS_SUBJECT_2,
        policy: {
            delegationEvidence: {
                notBefore: 1684843795,
                notOnOrAfter: 1799298267,
                policyIssuer: 'EU.EORI.UA482SOL',
                target: { accessSubject: process.env.ACCESS_SUBJECT_2 },
                policySets: [
                    {
                        target: { environment: { licenses: ['ISHARE.0002'] } },
                        policies: [
                            {
                                target: {
                                    resource: {
                                        type: 'EnergyConsumption',
                                        identifiers: [
                                            'urn:ngsi-ld:EnergyConsumption:private1692012529967x9681339860385792002023',
                                        ],
                                        attributes: ['*'],
                                    },
                                    actions: ['GET', 'POST', 'PATCH'],
                                },
                                rules: [{ effect: 'Permit' }],
                            },
                        ],
                    },
                ],
            },
        },
    },
    {
        policy_issuer: 'EU.EORI.UA482SOL',
        access_subject: process.env.ACCESS_SUBJECT_3,
        policy: {
            delegationEvidence: {
                notBefore: 1684843795,
                notOnOrAfter: 1799298267,
                policyIssuer: 'EU.EORI.UA482SOL',
                target: { accessSubject: process.env.ACCESS_SUBJECT_3 },
                policySets: [
                    {
                        target: { environment: { licenses: ['ISHARE.0002'] } },
                        policies: [
                            {
                                target: {
                                    resource: {
                                        type: 'EnergyConsumption',
                                        identifiers: [
                                            'urn:ngsi-ld:EnergyConsumption:private1692012591070x8165219819470193002023',
                                        ],
                                        attributes: ['*'],
                                    },
                                    actions: ['GET', 'POST', 'PATCH'],
                                },
                                rules: [{ effect: 'Permit' }],
                            },
                        ],
                    },
                ],
            },
        },
    },
];

export class InsertDelegationPolicy1697978923280 implements MigrationInterface {
    name = 'InsertDelegationPolicy1697978923280';

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.NODE_ENV === 'DEV') {
            const rowCount = await queryRunner.query('SELECT COUNT(*) as count FROM "delegation_policy"');

            if (Number(rowCount[0].count) === 0) {
                newPolicies.forEach(async (policy) =>
                    await queryRunner.query(`INSERT INTO "delegation_policy" ("policy_issuer", "access_subject","policy") VALUES ('${policy.policy_issuer}','${policy.access_subject}', '${JSON.stringify(policy.policy)}')`)
                )
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM "delegation_policy"');
    }
}
