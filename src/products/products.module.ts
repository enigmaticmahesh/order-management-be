import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { StoreProductsController } from './store-products.controller';

@Module({
  controllers: [ProductsController, StoreProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
