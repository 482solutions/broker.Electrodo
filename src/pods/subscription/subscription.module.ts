import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { DelegationPolicyModule } from '../delegation-policy/delegation-policy.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [DelegationPolicyModule, ReportModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports:[SubscriptionService]
})
export class SubscriptionModule {}
