import { Module } from '@nestjs/common';
import { ReportPolicyService } from './report-policy.service';
import { ReportPolicyController } from './report-policy.controller';
import { DelegationPolicyModule } from '../delegation-policy/delegation-policy.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [DelegationPolicyModule, ReportModule],
  controllers: [ReportPolicyController],
  providers: [ReportPolicyService],
})
export class ReportPolicyModule {}
