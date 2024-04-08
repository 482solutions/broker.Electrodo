import { Test, TestingModule } from '@nestjs/testing';
import { DelegationPolicyController } from './delegation-policy.controller';
import { DelegationPolicyService } from './delegation-policy.service';

describe('DelegationPolicyController', () => {
  let controller: DelegationPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelegationPolicyController],
      providers: [DelegationPolicyService],
    }).compile();

    controller = module.get<DelegationPolicyController>(DelegationPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
