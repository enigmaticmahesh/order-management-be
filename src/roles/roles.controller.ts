import { ApiResponseDTO } from '@/app.dto';
import { RolesService } from './roles.service';
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
import { DeleteRoleDTO, RoleDTO, UpdateRoleDTO } from './roles.dto';
import { AllowedRoles } from '@/authcore/decorators/allowed-roles.decorator';
import { UserRole } from '@/authcore/authcore.interface';
import { RolesGuard } from '@/authcore/guards/roles.guard';

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
  async updateRole(@Body() roleData: UpdateRoleDTO): Promise<ApiResponseDTO> {
    await this.rolesService.updateRole(roleData);
    return new ApiResponseDTO({
      message: 'Role updated succesfully',
    });
  }

  @Delete()
  async deleteRole(@Body() roleData: DeleteRoleDTO): Promise<ApiResponseDTO> {
    await this.rolesService.deleteRole(roleData);
    return new ApiResponseDTO({
      message: 'Role deleted succesfully',
    });
  }
}
