import { Test, TestingModule } from '@nestjs/testing';
import { DelegationPolicyService } from './delegation-policy.service';

describe('DelegationPolicyService', () => {
  let service: DelegationPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DelegationPolicyService],
    }).compile();

    service = module.get<DelegationPolicyService>(DelegationPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
