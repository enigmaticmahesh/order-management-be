import { Test, TestingModule } from '@nestjs/testing';
import { HsncodesController } from './hsncodes.controller';

describe('HsncodesController', () => {
  let controller: HsncodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HsncodesController],
    }).compile();

    controller = module.get<HsncodesController>(HsncodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
