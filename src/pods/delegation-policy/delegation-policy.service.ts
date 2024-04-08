import { ForbiddenException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateDelegationPolicyDto } from './dto/create-delegation-policy.dto';
import { UpdateDelegationPolicyDto } from './dto/update-delegation-policy.dto';
import { DelegationPolicy } from './entities/delegation-policy.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import baseDelegationPolicy from '../../utils/baseFiles/base-delegation-policy';
import { PolicyDto } from './dto/policy.dto';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

const BASE_DELEGATION_POLICY = Object.freeze(baseDelegationPolicy);

@Injectable()
export class DelegationPolicyService {
    private readonly logger = new Logger(DelegationPolicyService.name);

    constructor(
        @InjectRepository(DelegationPolicy)
        private readonly repository: Repository<DelegationPolicy>,
        private readonly configService: ConfigService,
    ) { }

    private createPolicy(newPolicy: CreateDelegationPolicyDto, baseDelegationPolicy: any, identifiers: string[]) {
        const delegationPolicy = cloneDeep(baseDelegationPolicy);
        const delegationEvidence = delegationPolicy.delegationEvidence;

        if (delegationEvidence.policyIssuer) {
            delegationEvidence.policyIssuer = newPolicy.policy_issuer;
        }
        if (delegationEvidence.target.accessSubject) {
            delegationEvidence.target.accessSubject = newPolicy.access_subject;
        }

        if (delegationEvidence.policySets) {
            const policyInSet = delegationEvidence.policySets[0].policies[0] || {};
            const policyInfo = {
                target: {
                    resource: {
                        type: newPolicy?.type,
                        identifiers,
                        attributes: policyInSet.target.resource.attributes,
                    },
                    actions: policyInSet.target.actions,
                },
                rules: [{ effect: newPolicy?.effect }],
            };
            delegationEvidence.policySets[0].policies[0] = policyInfo;
        }
        delegationPolicy.delegationEvidence = delegationEvidence;
        return delegationPolicy;
    }

    private updatePolicyTarget(policy: PolicyDto, newPolicy: UpdateDelegationPolicyDto, identifiers: string[]) {
        const policiesInSet = policy.delegationEvidence.policySets[0].policies;
        const basePolicy = BASE_DELEGATION_POLICY.delegationEvidence.policySets[0].policies[0];

        const policyIndexByIdentifiers = policiesInSet.findIndex((policy) =>
            policy.target.resource.identifiers.includes(newPolicy?.identifiers),
        );

        if (policyIndexByIdentifiers == -1) {
            const policyInfo = {
                target: {
                    resource: {
                        type: newPolicy?.type,
                        identifiers,
                        attributes: basePolicy.target.resource.attributes,
                    },
                    actions: basePolicy.target.actions,
                },
                rules: [{ effect: newPolicy?.effect }],
            };
            policiesInSet.push(policyInfo);
        } else {
            const existingTarget = policiesInSet[policyIndexByIdentifiers].target;
            existingTarget.actions = [...existingTarget.actions, basePolicy.target.actions];
            policiesInSet[policyIndexByIdentifiers].target = existingTarget;
        }
        return policiesInSet;
    }

    private updatePolicyTargetIdentifiers(policies: any[], policyIndex: number, suppliers: string[]) {
        const policyIdentifiers = policies[policyIndex].target.resource.identifiers || [];
        suppliers?.forEach((identifier: string) => {
            if (!policyIdentifiers?.includes(identifier)) {
                policyIdentifiers.push(identifier);
            }
        });
        policies[policyIndex].target.resource.identifiers = policyIdentifiers;
        return policies;
    }

    async handleDataSharing(data: PolicyDto, access_token: string) {
        const policyEndpoint = this.configService.get<string>('POLICY_ENDPOINT');
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Do-Not-Sign': 'true',
                Authorization: `Bearer ${access_token}`,
            };
            this.logger.debug(`Sending updated policy to ${policyEndpoint}: ${JSON.stringify(data)}`);
            const result = await axios.post(policyEndpoint, data, { headers });
            this.logger.log(`Response received from AR: ${JSON.stringify(result.data)}`);
        } catch (error) {
            this.logger.error(`Error updating policy data in ${policyEndpoint}. Access token: ${access_token}. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    async create(createDelegationPolicyDto: CreateDelegationPolicyDto, suppliersReportIds: string[]) {
        try {
            const { policy_issuer, access_subject } = createDelegationPolicyDto;

            const isDelegationPolicyGenerated = await this.repository.findOne({
                where: { policy_issuer, access_subject },
            });

            if (isDelegationPolicyGenerated) {
                throw new ForbiddenException(
                    `Duplicate data detected. Policy issuer: ${policy_issuer}. Access subject: ${access_subject} `,
                );
            }

            const delegationPolicyData = this.createPolicy(
                createDelegationPolicyDto,
                BASE_DELEGATION_POLICY,
                suppliersReportIds,
            );

            const delegationPolicy = new DelegationPolicy({
                policy_issuer,
                access_subject,
                policy: delegationPolicyData,
            });

            const newPolicy = await this.repository.save(delegationPolicy);
            this.logger.verbose(`Successfully added a new delegation policy: ${JSON.stringify(newPolicy)}`);
            return newPolicy;
        } catch (error) {
            this.logger.error('Error creating a delegation policy: ', error?.message, 'Stack Trace: ', error?.stack);
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to create a new delegation policy');
        }
    }

    async findAll(): Promise<DelegationPolicy[]> {
        try {
            const policies = await this.repository.find();
            this.logger.verbose(`Successfully receiving all delegation policies: ${JSON.stringify(policies)}`);
            return policies;
        } catch (error) {
            this.logger.error('Error getting the list of delegation policies', error?.message, 'Stack Trace: ', error?.stack);
            throw new InternalServerErrorException('Failed to get the list of delegation policies');
        }
    }
    async findByIssuerAndAccessSubject(policyIssuer: string, accessSubject: string): Promise<DelegationPolicy> {
        try {
            return await this.repository.findOne({
                where: { policy_issuer: policyIssuer, access_subject: accessSubject },
            });
        } catch (error) {
            this.logger.error(`Error getting delegation policy. Policy issuer: ${policyIssuer}. Access subject ${accessSubject}`, error?.message, 'Stack Trace: ', error?.stack);
            throw new InternalServerErrorException('Failed to get the delegation policy by policy issuer and access subject');
        }
    }

    async update(
        delegationPolicy: DelegationPolicy,
        updateDelegationPolicyData: UpdateDelegationPolicyDto,
        suppliersReportIds: string[],
        index?: number,
    ) {
        try {
            const policyCopy = cloneDeep(delegationPolicy.policy);
            const copiedPolicies = policyCopy.delegationEvidence.policySets[0].policies;
            let policyTarget: any[];

            if (updateDelegationPolicyData) {
                policyTarget = this.updatePolicyTarget(policyCopy, updateDelegationPolicyData, suppliersReportIds);
            } else {
                policyTarget = this.updatePolicyTargetIdentifiers(copiedPolicies, index, suppliersReportIds);
            }

            delegationPolicy.policy = policyCopy;
            await this.repository.save(delegationPolicy);
            return delegationPolicy;
        } catch (error) {
            this.logger.error('Error updating delegation policy: ', error?.message, 'Stack Trace: ', error?.stack);
            throw new InternalServerErrorException('Failed to update delegation policy');
        }
    }
}
