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
import { CategoriesService } from './categories.service';
import {
  CategoryDTO,
  DeleteCategoryDTO,
  PaginatedCategoriesQueryDTO,
  UpdateCategoryDTO,
} from './categories.dto';

@Controller('categories')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private catService: CategoriesService) {}

  @Get()
  async getCategories(
    @Query() query: PaginatedCategoriesQueryDTO,
  ): Promise<ApiResponseDTO> {
    const categories = await this.catService.getCategories(query);
    return new ApiResponseDTO({
      message: 'All the categories fetched succesfully',
      data: categories,
    });
  }

  @Post()
  async createCategory(@Body() catData: CategoryDTO): Promise<ApiResponseDTO> {
    await this.catService.createCategory(catData);
    return new ApiResponseDTO({
      message: 'Category created succesfully',
    });
  }

  @Put()
  async updateCategory(
    @Body(AtleastOneRequiredExceptID) catData: UpdateCategoryDTO,
  ): Promise<ApiResponseDTO> {
    await this.catService.updateCategory(catData);
    return new ApiResponseDTO({
      message: 'Category updated succesfully',
    });
  }

  @Delete(':id')
  async deleteCategory(
    @Param() catData: DeleteCategoryDTO,
  ): Promise<ApiResponseDTO> {
    await this.catService.deleteCategory(catData);
    return new ApiResponseDTO({
      message: 'Category deleted succesfully',
    });
  }
}
