import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedProductsQueryDTO } from './products.dto';
import { ApiResponseDTO } from '@/app.dto';
import { ProductsService } from './products.service';

@Controller('products/store-products')
export class StoreProductsController {
  constructor(private prodService: ProductsService) {}
  @Get()
  async getProducts(
    @Query() query: PaginatedProductsQueryDTO,
  ): Promise<ApiResponseDTO> {
    const products = await this.prodService.getProducts(query);
    return new ApiResponseDTO({
      message: 'All the products fetched succesfully',
      data: products,
    });
  }
}
