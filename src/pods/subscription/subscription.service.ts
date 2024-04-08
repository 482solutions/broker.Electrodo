import { Injectable, Logger } from '@nestjs/common';
import { ReportService } from '../report/report.service';
import { DelegationPolicyService } from '../delegation-policy/delegation-policy.service';
import { DelegationPolicy } from '../delegation-policy/entities/delegation-policy.entity';
import { ConfigService } from '@nestjs/config';
import { defaultPolicies } from '../../utils/baseFiles';
import { createJWS } from '../../utils/jws-helper';
import axios from 'axios';
import moment from 'moment';
import * as uuid from 'uuid';
import _ from 'lodash';

@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);
    constructor(
        private readonly reportService: ReportService,
        private readonly delegationPolicyService: DelegationPolicyService,
        private readonly configService: ConfigService,
    ) {}

    // TODO: move to authorisation-registry.module.ts
    private async getClientAssertion() {
        const clientId = this.configService.get<string>('CLIENT_ID');
        const idpId = this.configService.get<string>('IDP_ID');
        const privateKeyM2M = this.configService.get<string>('JWT_PRIVATE_KEY_M2M');
        const certChainM2M = this.configService.get<string[]>('JWT_CERT_CHAIN_M2M');
        const now = moment();
        const iat = now.unix();
        const exp = now.add(30, 'seconds').unix();

        const payload = {
            jti: uuid.v4(),
            iss: clientId,
            sub: clientId,
            aud: idpId,
            iat,
            nbf: iat,
            exp,
        };
        try {
            return await createJWS(
                privateKeyM2M,
                certChainM2M,
                payload,
            );
        } catch (error) {
            this.logger.error(`Error generating JWS token.
             M2M JWT private key: ${privateKeyM2M}.
             M2M JWT certificate chain: ${certChainM2M}. 
             IDP-ID: ${idpId}. Message:  `, error?.message,
                'Stack Trace: ', error?.stack
            );
            throw error;
        }
    }

    // TODO: move to authorisation-registry.module.ts
    private async getAccessToken() {
        const tokenEndpoint = this.configService.get<string>('TOKEN_ENDPOINT');
        try {
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            const client_id = this.configService.get<string>('CLIENT_ID');
            const client_assertion_type = this.configService.get<string>('CLIENT_ASSERTION_TYPE');
            const grant_type = this.configService.get<string>('GRANT_TYPE');
            const scope = this.configService.get<string>('SCOPE');

            const client_assertion = await this.getClientAssertion();

            const data = {
                grant_type,
                scope,
                client_assertion_type,
                client_assertion,
                client_id,
            };
            this.logger.debug(`Sending data to ${tokenEndpoint}: ${JSON.stringify(data)}`);
            const result = await axios.post(tokenEndpoint, data, {
                headers,
            });
            this.logger.log(`Response received from AR. Access token: ${JSON.stringify(result.data)}`);
            return result?.data || {};
        } catch (error) {
            this.logger.error(`Error retrieving access token: Token endpoint: ${tokenEndpoint}. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    // TODO: refactor report-policy, rename to data-sharing.module, move handleSuppliersData to data-sharing
    async handleSuppliersData(privateReport: any) {
        try {
            privateReport = privateReport?.data?.[0]; //need to check data format
            const suppliers = privateReport?.suppliers?.value || [];

            if (suppliers?.length > 0) {
                const { access_token } = await this.getAccessToken();
                const delegationPolicies = await this.delegationPolicyService.findAll();

                delegationPolicies?.forEach(async (delegationPolicy: DelegationPolicy) => {
                    const policies = delegationPolicy.policy.delegationEvidence.policySets[0].policies || [];
                    const policyIndex = policies?.findIndex(
                        (policy: any) => policy.target?.resource?.identifiers.includes(privateReport?.id),
                    );

                    if (policyIndex !== -1) {
                        const updatedPolicy = await this.delegationPolicyService.update(
                            delegationPolicy,
                            null,
                            suppliers,
                            policyIndex,
                        );
                        await this.delegationPolicyService.handleDataSharing(updatedPolicy?.policy, access_token);
                    }
                });

                await this.reportService.addSuppliers(privateReport?.id, suppliers);
            }
            return 'Successfully updated the list of report suppliers';
        } catch (error) {
            this.logger.error('Error updating the list of suppliers', error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    async createDefaultPolicies() {
        try {
            const delegationPolicies = await this.delegationPolicyService.findAll();
            const policyList = delegationPolicies.map((delegationEvidence) => delegationEvidence.policy);
            const defaultH2MPolicies = defaultPolicies.slice(0, -1);
            const isArrayEqual =
                _.size(policyList) === _.size(defaultH2MPolicies) &&
                _.isEmpty(_.xorWith(policyList, defaultH2MPolicies, _.isEqual));

            if (isArrayEqual) {
                const { access_token } = await this.getAccessToken();

                const createPolicyPromises = defaultPolicies?.map(
                    async (delegationPolicy: DelegationPolicy['policy']) =>
                        await this.delegationPolicyService.handleDataSharing(delegationPolicy, access_token),
                );

                await Promise.all(createPolicyPromises);
                return 'Successfully created default delegation policies';
            }
        } catch (error) {
            this.logger.error('Error creating default delegation policies:', error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }
}
