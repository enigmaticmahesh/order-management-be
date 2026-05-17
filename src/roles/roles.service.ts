import { DrizzleService } from '@/db/drizzle/drizzle.service';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeleteRoleDTO, RoleDTO, UpdateRoleDTO } from './roles.dto';
import { Role } from './roles.interface';
import { eq } from 'drizzle-orm';

@Injectable()
export class RolesService {
  private logger = new Logger(RolesService.name);
  constructor(private readonly ds: DrizzleService) {}

  private get db() {
    return this.ds.getDb();
  }

  async createRole(roleData: RoleDTO) {
    try {
      const { roles } = this.ds.getSchema();
      const newRole: Role = { name: roleData.role };
      await this.db.insert(roles).values(newRole);
    } catch (err: any) {
      this.logger.error('Error while creating a new role:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This role is already exists.');
      }
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      return this.db.query.roles.findMany();
    } catch (err) {
      this.logger.error('Error while fetching role:', err);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  async updateRole(roleData: UpdateRoleDTO) {
    try {
      const { roles } = this.ds.getSchema();
      const newRole: Role = { name: roleData.role };
      const [updatedRole] = await this.db
        .update(roles)
        .set(newRole)
        .where(eq(roles.id, roleData.id))
        .returning();
      if (!updatedRole) {
        throw new NotFoundException('Role not found');
      }
    } catch (err: any) {
      this.logger.error('Error while updating the role:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.cause.code === '23505') {
        throw new ConflictException('This role is already exists.');
      }
      throw new InternalServerErrorException('Failed to update the role');
    }
  }

  async deleteRole(roleData: DeleteRoleDTO) {
    try {
      const { roles } = this.ds.getSchema();
      const res = await this.db.delete(roles).where(eq(roles.id, roleData.id));
      if (res.rowCount === 0) {
        throw new NotFoundException('Role not found');
      }
    } catch (err: any) {
      this.logger.error('Error while deleting the role:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete the role');
    }
  }
}
