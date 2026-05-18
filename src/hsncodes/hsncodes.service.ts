import { DrizzleService } from '@/db/drizzle/drizzle.service';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import {
  CreateHsnCodeDTO,
  DeleteHsnCodeDTO,
  UpdateHsnCodeDTO,
} from './hsncodes.dto';
import { HsnCode } from './hsncodes.interface';

@Injectable()
export class HsncodesService {
  private logger = new Logger(HsncodesService.name);
  constructor(private readonly ds: DrizzleService) {}

  private get db() {
    return this.ds.getDb();
  }

  async createCode(hsnData: CreateHsnCodeDTO) {
    try {
      const { hsnCodes } = this.ds.getSchema();
      await this.db.insert(hsnCodes).values(hsnData);
    } catch (err: any) {
      this.logger.error('Error while creating a new hsn code:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This hsn code is already exists.');
      }
      throw new InternalServerErrorException('Failed to create hsn code');
    }
  }

  async getCodes(): Promise<HsnCode[]> {
    try {
      return this.db.query.hsnCodes.findMany();
    } catch (err) {
      this.logger.error('Error while fetching HSN codes:', err);
      throw new InternalServerErrorException('Failed to fetch HSN codes');
    }
  }

  async updateCode(hsnData: UpdateHsnCodeDTO) {
    try {
      const { hsnCodes } = this.ds.getSchema();
      const { id, ...newHsnCode } = hsnData;
      const [updatedCode] = await this.db
        .update(hsnCodes)
        .set(newHsnCode)
        .where(eq(hsnCodes.id, id))
        .returning();
      if (!updatedCode) {
        throw new NotFoundException('HSN code not found');
      }
    } catch (err: any) {
      this.logger.error('Error while updating the HSN code:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.cause.code === '23505') {
        throw new ConflictException('This HSN code is already exists.');
      }
      throw new InternalServerErrorException('Failed to update the HSN code');
    }
  }

  async deleteCode(hsnData: DeleteHsnCodeDTO) {
    try {
      const { hsnCodes } = this.ds.getSchema();
      const res = await this.db
        .delete(hsnCodes)
        .where(eq(hsnCodes.id, hsnData.id));
      if (res.rowCount === 0) {
        throw new NotFoundException('HSN code not found');
      }
    } catch (err: any) {
      this.logger.error('Error while deleting the HSN code:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete the HSN code');
    }
  }
}
