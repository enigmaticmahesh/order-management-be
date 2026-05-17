import { ApiResponseDTO } from '@/app.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/authcore/guards/auth.guard';
import { DeleteBrandDTO, BrandDTO, UpdateBrandDTO } from './brands.dto';
import { AllowedRoles } from '@/authcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/authcore/authcore.interface';
import { RolesGuard } from '@/authcore/guards/roles.guard';
import { BrandsService } from './brands.service';

@Controller('brands')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  async getBrands(): Promise<ApiResponseDTO> {
    const brands = await this.brandsService.getBrands();
    return new ApiResponseDTO({
      message: 'All the brands fetched succesfully',
      data: brands,
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
    @Body() brandData: UpdateBrandDTO,
  ): Promise<ApiResponseDTO> {
    await this.brandsService.updateBrand(brandData);
    return new ApiResponseDTO({
      message: 'Brand updated succesfully',
    });
  }

  @Delete()
  async deleteBrand(
    @Body() brandData: DeleteBrandDTO,
  ): Promise<ApiResponseDTO> {
    await this.brandsService.deleteBrand(brandData);
    return new ApiResponseDTO({
      message: 'Brand deleted succesfully',
    });
  }
}
