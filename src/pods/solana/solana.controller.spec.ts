import { Test, TestingModule } from '@nestjs/testing';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana.service';

describe('SolanaController', () => {
  let controller: SolanaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolanaController],
      providers: [SolanaService],
    }).compile();

    controller = module.get<SolanaController>(SolanaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
