import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ReportService } from '../report/report.service';
import { DelegationPolicyService } from '../delegation-policy/delegation-policy.service';
import { CreateDelegationPolicyDto } from '../delegation-policy/dto/create-delegation-policy.dto';
import { DelegationPolicy } from '../delegation-policy/entities/delegation-policy.entity';

@Injectable()
export class ReportPolicyService {
    private readonly logger = new Logger(ReportPolicyService.name);
    constructor(
        private readonly reportService: ReportService,
        private readonly delegationPolicyService: DelegationPolicyService,
    ) {}

    async shareData(delegationPolicyData: CreateDelegationPolicyDto): Promise<DelegationPolicy | string> {
        try {
            const { policy_issuer, access_subject, access_token } = delegationPolicyData;
            const delegationPolicy = await this.delegationPolicyService.findByIssuerAndAccessSubject(
                policy_issuer,
                access_subject,
            );
            let policyData: DelegationPolicy;

            const policyTargetIdentifiers = await this.reportService.getPolicyTargetIdentifiers(
                delegationPolicyData?.identifiers,
            );

            if (!delegationPolicy) {
                policyData = await this.delegationPolicyService.create(delegationPolicyData, policyTargetIdentifiers);
            } else {
                policyData = await this.delegationPolicyService.update(
                    delegationPolicy,
                    delegationPolicyData,
                    policyTargetIdentifiers,
                );
            }

            if (policyData?.policy) {
                await this.delegationPolicyService.handleDataSharing(policyData.policy, access_token);
                return policyData;
            }
            return `No new policy to create or update`;
        } catch (error) {
            this.logger.error('Error when sharing delegation policy data: ', error?.message, 'Stack Trace: ', error?.stack)
            throw new InternalServerErrorException('Failed to share delegation policy');
        }
    }
}
