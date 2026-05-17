import { Test, TestingModule } from '@nestjs/testing';
import { HsncodesService } from './hsncodes.service';

describe('HsncodesService', () => {
  let service: HsncodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HsncodesService],
    }).compile();

    service = module.get<HsncodesService>(HsncodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
