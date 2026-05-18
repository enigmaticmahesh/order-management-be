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
import { HsncodesService } from './hsncodes.service';
import {
  CreateHsnCodeDTO,
  DeleteHsnCodeDTO,
  UpdateHsnCodeDTO,
} from './hsncodes.dto';
import { AtleastOneRequiredExceptID } from '@/sharedcore/pipes/atleast-one.pipe';

@Controller('hsncodes')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class HsncodesController {
  constructor(private hsnService: HsncodesService) {}

  @Get()
  async getCodes(): Promise<ApiResponseDTO> {
    const codes = await this.hsnService.getCodes();
    return new ApiResponseDTO({
      message: 'All the codes fetched succesfully',
      data: codes,
    });
  }

  @Post()
  async createCode(
    @Body() codeData: CreateHsnCodeDTO,
  ): Promise<ApiResponseDTO> {
    await this.hsnService.createCode(codeData);
    return new ApiResponseDTO({
      message: 'HSN code created succesfully',
    });
  }

  @Put()
  async updateCode(
    @Body(AtleastOneRequiredExceptID) codeData: UpdateHsnCodeDTO,
  ): Promise<ApiResponseDTO> {
    await this.hsnService.updateCode(codeData);
    return new ApiResponseDTO({
      message: 'HSN code updated succesfully',
    });
  }

  @Delete(':id')
  async deleteCode(
    @Param() codeData: DeleteHsnCodeDTO,
  ): Promise<ApiResponseDTO> {
    await this.hsnService.deleteCode(codeData);
    return new ApiResponseDTO({
      message: 'HSN code deleted succesfully',
    });
  }
}
