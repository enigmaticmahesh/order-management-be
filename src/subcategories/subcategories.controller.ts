import { ApiResponseDTO } from '@/app.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/sharedcore/guards/auth.guard';
import { AllowedRoles } from '@/sharedcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/sharedcore/sharedcore.interface';
import { RolesGuard } from '@/sharedcore/guards/roles.guard';
import { AtleastOneRequiredExceptID } from '@/sharedcore/pipes/atleast-one.pipe';
import { SubcategoriesService } from './subcategories.service';
import {
  CatIDDTO,
  DeleteSubCatDTO,
  SubCatDTO,
  UpdateSubCatDTO,
} from './subcat.dto';

@Controller('subcategories')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class SubcategoriesController {
  constructor(private subCatService: SubcategoriesService) {}

  @Get(':catId')
  async getSubCatsByCatId(
    @Param() catIdData: CatIDDTO,
  ): Promise<ApiResponseDTO> {
    const subcats = await this.subCatService.getSubCatsByCatId(catIdData);
    return new ApiResponseDTO({
      message: 'All the sub categories fetched succesfully',
      data: subcats,
    });
  }

  @Get()
  async getSubCats(): Promise<ApiResponseDTO> {
    const subcats = await this.subCatService.getSubCats();
    return new ApiResponseDTO({
      message: 'All the sub categories fetched succesfully',
      data: subcats,
    });
  }

  @Post()
  async createSubCat(@Body() subCatData: SubCatDTO): Promise<ApiResponseDTO> {
    await this.subCatService.createSubCat(subCatData);
    return new ApiResponseDTO({
      message: 'Sub category created succesfully',
    });
  }

  @Put()
  async updateSubCat(
    @Body(AtleastOneRequiredExceptID) subCatData: UpdateSubCatDTO,
  ): Promise<ApiResponseDTO> {
    await this.subCatService.updateSubCat(subCatData);
    return new ApiResponseDTO({
      message: 'Sub category updated succesfully',
    });
  }

  @Delete(':id')
  async deleteSubCat(
    @Param() subCatData: DeleteSubCatDTO,
  ): Promise<ApiResponseDTO> {
    await this.subCatService.deleteSubCat(subCatData);
    return new ApiResponseDTO({
      message: 'Sub category deleted succesfully',
    });
  }
}
