import { Module } from '@nestjs/common';
import { DelegationPolicyService } from './delegation-policy.service';
import { DelegationPolicyController } from './delegation-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelegationPolicy } from './entities/delegation-policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DelegationPolicy])],
  controllers: [DelegationPolicyController],
  providers: [DelegationPolicyService],
  exports: [DelegationPolicyService]
})
export class DelegationPolicyModule {}
