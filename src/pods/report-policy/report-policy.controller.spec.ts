import { Test, TestingModule } from '@nestjs/testing';
import { ReportPolicyController } from './report-policy.controller';
import { ReportPolicyService } from './report-policy.service';

describe('ReportPolicyController', () => {
  let controller: ReportPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportPolicyController],
      providers: [ReportPolicyService],
    }).compile();

    controller = module.get<ReportPolicyController>(ReportPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
