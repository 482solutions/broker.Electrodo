import { Test, TestingModule } from '@nestjs/testing';
import { FroniusAdapterService } from './fronius-adapter.service';

describe('FroniusAdapterService', () => {
  let service: FroniusAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FroniusAdapterService],
    }).compile();

    service = module.get<FroniusAdapterService>(FroniusAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
