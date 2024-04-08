import { PartialType } from '@nestjs/mapped-types';
import { CreateDelegationPolicyDto } from './create-delegation-policy.dto';

export class UpdateDelegationPolicyDto extends PartialType(CreateDelegationPolicyDto) {}
