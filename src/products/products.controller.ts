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
  DeleteImagesDTO,
  DeleteProductDTO,
  FolderPathDTO,
  PaginatedProductsQueryDTO,
  ProductURLDTO,
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
    const { id, sku, barCode } = await this.prodService.createProduct(codeData);
    const data = { id, sku, barCode };
    return new ApiResponseDTO({
      message: 'Product created succesfully',
      data,
    });
  }

  @Post('delete-images')
  async deleteProductImages(
    @Body() data: DeleteImagesDTO,
  ): Promise<ApiResponseDTO> {
    await this.prodService.deleteProductImages(data.fileIds);
    return new ApiResponseDTO({
      message: 'Product images deleted succesfully',
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

  @Get('gen-upload-urls')
  async getUploadURLs(@Query() query: ProductURLDTO): Promise<ApiResponseDTO> {
    const urlData = this.prodService.generateProductImgUploadURLs(query);
    return new ApiResponseDTO({
      message: 'All the products fetched succesfully',
      data: urlData,
    });
  }

  @Get('get-files-count')
  async getFilesCount(@Query() query: FolderPathDTO): Promise<ApiResponseDTO> {
    const files = await this.prodService.getFilesCount(query.path);
    return new ApiResponseDTO({
      message: 'Product files count fetched succesfully',
      data: { files },
    });
  }
}
