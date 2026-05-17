import { ApiResponseDTO } from '@/app.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/authcore/guards/auth.guard';
import { AllowedRoles } from '@/authcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/authcore/authcore.interface';
import { RolesGuard } from '@/authcore/guards/roles.guard';
import { HsncodesService } from './hsncodes.service';
import {
  CreateHsnCodeDTO,
  DeleteHsnCodeDTO,
  UpdateHsnCodeDTO,
} from './hsncodes.dto';

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
    @Body() codeData: UpdateHsnCodeDTO,
  ): Promise<ApiResponseDTO> {
    if (Object.keys(codeData).length < 1) {
      throw new BadRequestException('Atleast one of the field is required');
    }
    await this.hsnService.updateCode(codeData);
    return new ApiResponseDTO({
      message: 'HSN code updated succesfully',
    });
  }

  @Delete()
  async deleteCode(
    @Body() codeData: DeleteHsnCodeDTO,
  ): Promise<ApiResponseDTO> {
    await this.hsnService.deleteCode(codeData);
    return new ApiResponseDTO({
      message: 'HSN code deleted succesfully',
    });
  }
}
