import { Controller, Get,  Param, ValidationPipe, UsePipes, Put } from '@nestjs/common';
import { DelegationPolicyService } from './delegation-policy.service';
import { DelegationPolicy } from './entities/delegation-policy.entity';

@Controller('delegation-policy')
@UsePipes(ValidationPipe)

export class DelegationPolicyController {
  constructor(private readonly delegationPolicyService: DelegationPolicyService) {}

  @Get()
  public async findAll():Promise<DelegationPolicy[]> {
    return this.delegationPolicyService.findAll();
  }

  @Get('/:issuer/:accessSubject')
  public async findOne(
    @Param('issuer') issuer: string,
    @Param('accessSubject') accessSubject: string,
    ) {
    return this.delegationPolicyService.findByIssuerAndAccessSubject(issuer, accessSubject);
  }

}
