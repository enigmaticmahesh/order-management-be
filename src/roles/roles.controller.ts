import { ApiResponseDTO } from '@/app.dto';
import { RolesService } from './roles.service';
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
import { DeleteRoleDTO, RoleDTO, UpdateRoleDTO } from './roles.dto';
import { AllowedRoles } from '@/sharedcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/sharedcore/sharedcore.interface';
import { RolesGuard } from '@/sharedcore/guards/roles.guard';
import { AtleastOneRequiredExceptID } from '@/sharedcore/pipes/atleast-one.pipe';

@Controller('roles')
@AllowedRoles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  async getRoles(): Promise<ApiResponseDTO> {
    const roles = await this.rolesService.getRoles();
    return new ApiResponseDTO({
      message: 'All the roles fetched succesfully',
      data: roles,
    });
  }

  @Post()
  async createRole(@Body() roleData: RoleDTO): Promise<ApiResponseDTO> {
    await this.rolesService.createRole(roleData);
    return new ApiResponseDTO({
      message: 'Role created succesfully',
    });
  }

  @Put()
  async updateRole(
    @Body(AtleastOneRequiredExceptID) roleData: UpdateRoleDTO,
  ): Promise<ApiResponseDTO> {
    await this.rolesService.updateRole(roleData);
    return new ApiResponseDTO({
      message: 'Role updated succesfully',
    });
  }

  @Delete(':id')
  async deleteRole(@Param() roleData: DeleteRoleDTO): Promise<ApiResponseDTO> {
    await this.rolesService.deleteRole(roleData);
    return new ApiResponseDTO({
      message: 'Role deleted succesfully',
    });
  }
}
