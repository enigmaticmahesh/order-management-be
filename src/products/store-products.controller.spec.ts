import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductsController } from './store-products.controller';

describe('StoreProductsController', () => {
  let controller: StoreProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreProductsController],
    }).compile();

    controller = module.get<StoreProductsController>(StoreProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
