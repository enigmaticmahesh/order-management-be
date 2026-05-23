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
import {
  DeleteBrandDTO,
  BrandDTO,
  UpdateBrandDTO,
  PaginatedBrandsQueryDTO,
} from './brands.dto';
import { AllowedRoles } from '@/sharedcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/sharedcore/sharedcore.interface';
import { RolesGuard } from '@/sharedcore/guards/roles.guard';
import { BrandsService } from './brands.service';
import { AtleastOneRequiredExceptID } from '@/sharedcore/pipes/atleast-one.pipe';

@Controller('brands')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  async getBrands(
    @Query() query: PaginatedBrandsQueryDTO,
  ): Promise<ApiResponseDTO> {
    const brandsData = await this.brandsService.getBrands(query);
    return new ApiResponseDTO({
      message: 'All the brands fetched succesfully',
      data: brandsData,
    });
  }

  @Post()
  async createBrand(@Body() brandData: BrandDTO): Promise<ApiResponseDTO> {
    await this.brandsService.createBrand(brandData);
    return new ApiResponseDTO({
      message: 'Brand created succesfully',
    });
  }

  @Put()
  async updateBrand(
    @Body(AtleastOneRequiredExceptID) brandData: UpdateBrandDTO,
  ): Promise<ApiResponseDTO> {
    await this.brandsService.updateBrand(brandData);
    return new ApiResponseDTO({
      message: 'Brand updated succesfully',
    });
  }

  @Delete(':id')
  async deleteBrand(
    @Param() brandData: DeleteBrandDTO,
  ): Promise<ApiResponseDTO> {
    await this.brandsService.deleteBrand(brandData);
    return new ApiResponseDTO({
      message: 'Brand deleted succesfully',
    });
  }
}
