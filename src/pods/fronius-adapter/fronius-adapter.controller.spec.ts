import { Test, TestingModule } from '@nestjs/testing';
import { FroniusAdapterController } from './fronius-adapter.controller';
import { FroniusAdapterService } from './fronius-adapter.service';

describe('FroniusAdapterController', () => {
  let controller: FroniusAdapterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FroniusAdapterController],
      providers: [FroniusAdapterService],
    }).compile();

    controller = module.get<FroniusAdapterController>(FroniusAdapterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
