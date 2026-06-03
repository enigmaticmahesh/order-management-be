import { ApiResponseDTO } from '@/app.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/sharedcore/guards/auth.guard';
import { AllowedRoles } from '@/sharedcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/sharedcore/sharedcore.interface';
import { RolesGuard } from '@/sharedcore/guards/roles.guard';
import { AtleastOneRequiredExceptID } from '@/sharedcore/pipes/atleast-one.pipe';
import { ProductsService } from './products.service';
import {
  CreateProductDTO,
  DeleteProductDTO,
  PaginatedProductsQueryDTO,
  UpdateProductDTO,
} from './products.dto';

@Controller('products')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class ProductsController {
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

  @Post()
  async createProduct(
    @Body() codeData: CreateProductDTO,
  ): Promise<ApiResponseDTO> {
    await this.prodService.createProduct(codeData);
    return new ApiResponseDTO({
      message: 'Product created succesfully',
    });
  }

  @Put()
  async updateProduct(
    @Body(AtleastOneRequiredExceptID) codeData: UpdateProductDTO,
  ): Promise<ApiResponseDTO> {
    await this.prodService.updateProduct(codeData);
    return new ApiResponseDTO({
      message: 'Product updated succesfully',
    });
  }

  @Delete(':id')
  async deleteProduct(
    @Param() codeData: DeleteProductDTO,
  ): Promise<ApiResponseDTO> {
    await this.prodService.deleteProduct(codeData);
    return new ApiResponseDTO({
      message: 'Product deleted succesfully',
    });
  }
}
