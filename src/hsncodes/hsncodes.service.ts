import { DrizzleService } from '@/db/drizzle/drizzle.service';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, gt, ilike, lt } from 'drizzle-orm';
import {
  CreateHsnCodeDTO,
  DeleteHsnCodeDTO,
  PaginatedHSNCodesQueryDTO,
  UpdateHsnCodeDTO,
} from './hsncodes.dto';
import { HsnCode, HSNCodesListResponse } from './hsncodes.interface';
import { DBQueryConfig } from 'drizzle-orm';

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

  private _getConfig(query: PaginatedHSNCodesQueryDTO): DBQueryConfig {
    const defaultConfig: DBQueryConfig = {
      where: (hsncode) => {
        return and(
          query.cursor ? lt(hsncode.id, query.cursor) : undefined,
          query.code ? ilike(hsncode.code, `%${query.code}%`) : undefined,
        );
      },
      limit: query.limit + 1, // Fetch extra one row to check if there are more brands in the table
      // offset: (query.page - 1) * query.limit,
      orderBy: (hsnCodes, { desc }) => desc(hsnCodes.id),
    };

    if (query.dir === 'prev') {
      defaultConfig.where = (hsncode) => {
        // Moving Backward (Previous): Grab items with LARGER IDs than the current page start cursor.
        // Sorted ascendingly to grab immediate physical neighbors near the boundary.
        return and(
          query.cursor ? gt(hsncode.id, query.cursor) : undefined,
          query.code ? ilike(hsncode.code, `%${query.code}%`) : undefined,
        );
      };
      defaultConfig.orderBy = (hsnCodes, { asc }) => asc(hsnCodes.id);
    }
    return defaultConfig;
  }

  private _hsnCodesListResponse(
    fetchedHsnCodes: HsnCode[],
    query: PaginatedHSNCodesQueryDTO,
  ): HSNCodesListResponse {
    const hasMore = fetchedHsnCodes.length > query.limit;
    const responseData: HSNCodesListResponse = {
      nextID: 0,
      firstID: 0,
      hasNext: false,
      hasPrev: false,
      codes: fetchedHsnCodes,
    };

    fetchedHsnCodes = fetchedHsnCodes.slice(0, query.limit); // Remove the extra row that we fetched to detect if there are more rows

    // 2. Because moving backward (before) forces an ASC sort, the DB returns records reversed.
    // We reverse them back to descending chronological order to maintain consistent presentation.
    if (query.dir === 'prev') {
      fetchedHsnCodes = fetchedHsnCodes.reverse();
    }

    if (fetchedHsnCodes.length > 0) {
      responseData.nextID = fetchedHsnCodes[fetchedHsnCodes.length - 1].id!;
      responseData.firstID = fetchedHsnCodes[0].id!;
    }

    switch (query.dir) {
      case 'next':
        responseData.hasNext = hasMore;
        responseData.hasPrev = true;
        break;
      case 'prev':
        responseData.hasNext = true;
        responseData.hasPrev = hasMore;
        break;
      default:
        responseData.hasNext = hasMore;
        responseData.hasPrev = false;
    }

    responseData.codes = fetchedHsnCodes;
    return responseData;
  }

  async getCodes(
    query: PaginatedHSNCodesQueryDTO,
  ): Promise<HSNCodesListResponse> {
    try {
      const conditions: DBQueryConfig = this._getConfig(query);

      const fetchedHsnCodes = await this.db.query.hsnCodes.findMany(conditions);

      const responseData = this._hsnCodesListResponse(fetchedHsnCodes, query);
      return responseData;
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
