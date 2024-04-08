import { Controller, Body, Put } from '@nestjs/common';
import { ReportPolicyService } from './report-policy.service';
import { CreateDelegationPolicyDto } from '../delegation-policy/dto/create-delegation-policy.dto';
import { DelegationPolicy } from '../delegation-policy/entities/delegation-policy.entity';

@Controller('report-policy')
export class ReportPolicyController {
  constructor(private readonly reportPolicyService: ReportPolicyService) {}
  @Put()
  public async shareData(
    @Body() createOrUpdatePolicy: CreateDelegationPolicyDto,
  ): Promise<DelegationPolicy | string> {
    return this.reportPolicyService.shareData(createOrUpdatePolicy);
  }
}
