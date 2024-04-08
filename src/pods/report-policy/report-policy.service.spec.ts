import { Test, TestingModule } from '@nestjs/testing';
import { ReportPolicyService } from './report-policy.service';

describe('ReportPolicyService', () => {
  let service: ReportPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportPolicyService],
    }).compile();

    service = module.get<ReportPolicyService>(ReportPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
