import { Controller, Get, Query, Param } from '@nestjs/common';
import { PaginatedProductsQueryDTO, ProductDetailsParamDTO } from './products.dto';
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

  @Get('/discounted')
  async getDiscountedProducts(): Promise<ApiResponseDTO> {
    const products = await this.prodService.getDiscountedProducts();
    return new ApiResponseDTO({
      message: 'All the discounted products fetched succesfully',
      data: products,
    });
  }

  @Get('/popular')
  async getPopularProducts(): Promise<ApiResponseDTO> {
    const products = await this.prodService.getDiscountedProducts();
    return new ApiResponseDTO({
      message: 'All the popular products fetched succesfully',
      data: products,
    });
  }

  @Get(':id')
  async getProductById(
    @Param() params: ProductDetailsParamDTO,
  ): Promise<ApiResponseDTO> {
    const product = await this.prodService.getProductById(params.id);

    return new ApiResponseDTO({
      message: 'Product fetched successfully',
      data: product,
    });
  }
}
