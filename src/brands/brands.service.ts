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
  BrandDTO,
  DeleteBrandDTO,
  PaginatedBrandsQueryDTO,
  UpdateBrandDTO,
} from './brands.dto';
import { Brand, BrandsListResponse } from './brands.interface';
import { DBQueryConfig } from 'drizzle-orm';

@Injectable()
export class BrandsService {
  private logger = new Logger(BrandsService.name);
  constructor(private readonly ds: DrizzleService) {}

  private get db() {
    return this.ds.getDb();
  }

  async createBrand(brandData: BrandDTO) {
    try {
      const { brands } = this.ds.getSchema();
      const newBrand: Brand = { name: brandData.brand };
      await this.db.insert(brands).values(newBrand);
    } catch (err: any) {
      this.logger.error('Error while creating a new brand:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This brand is already exists.');
      }
      throw new InternalServerErrorException('Failed to create brand');
    }
  }

  private _getConfig(query: PaginatedBrandsQueryDTO): DBQueryConfig {
    const defaultConfig: DBQueryConfig = {
      where: (brand) => {
        return and(
          query.cursor ? lt(brand.id, query.cursor) : undefined,
          query.search ? ilike(brand.name, `%${query.search}%`) : undefined,
        );
      },
      limit: query.limit + 1, // Fetch extra one row to check if there are more brands in the table
      // offset: (query.page - 1) * query.limit,
      orderBy: (brands, { desc }) => desc(brands.id),
    };

    if (query.dir === 'prev') {
      defaultConfig.where = (brand) => {
        // Moving Backward (Previous): Grab items with LARGER IDs than the current page start cursor.
        // Sorted ascendingly to grab immediate physical neighbors near the boundary.
        return and(
          query.cursor ? gt(brand.id, query.cursor) : undefined,
          query.search ? ilike(brand.name, `%${query.search}%`) : undefined,
        );
      };
      defaultConfig.orderBy = (brands, { asc }) => asc(brands.id);
    }
    return defaultConfig;
  }

  private _brandsListResponse(
    fetchedBrands: Brand[],
    query: PaginatedBrandsQueryDTO,
  ): BrandsListResponse {
    const hasMore = fetchedBrands.length > query.limit;
    const responseData: BrandsListResponse = {
      nextID: 0,
      firstID: 0,
      hasNext: false,
      hasPrev: false,
      brands: fetchedBrands,
    };

    fetchedBrands = fetchedBrands.slice(0, query.limit); // Remove the extra row that we fetched to detect if there are more rows

    // 2. Because moving backward (before) forces an ASC sort, the DB returns records reversed.
    // We reverse them back to descending chronological order to maintain consistent presentation.
    if (query.dir === 'prev') {
      fetchedBrands = fetchedBrands.reverse();
    }

    if (fetchedBrands.length > 0) {
      responseData.nextID = fetchedBrands[fetchedBrands.length - 1].id!;
      responseData.firstID = fetchedBrands[0].id!;
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

    responseData.brands = fetchedBrands;
    return responseData;
  }

  async getBrands(query: PaginatedBrandsQueryDTO): Promise<BrandsListResponse> {
    try {
      const conditions: DBQueryConfig = this._getConfig(query);

      const fetchedBrands = await this.db.query.brands.findMany(conditions);

      const responseData = this._brandsListResponse(fetchedBrands, query);
      return responseData;
    } catch (err) {
      this.logger.error('Error while fetching Brands:', err);
      throw new InternalServerErrorException('Failed to fetch Brands');
    }
  }

  async updateBrand(brandData: UpdateBrandDTO) {
    try {
      const { brands } = this.ds.getSchema();
      const newBrand: Brand = { name: brandData.brand };
      const [updatedBrand] = await this.db
        .update(brands)
        .set(newBrand)
        .where(eq(brands.id, brandData.id))
        .returning();
      if (!updatedBrand) {
        throw new NotFoundException('Brand not found');
      }
    } catch (err: any) {
      this.logger.error('Error while updating the Brand:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.cause.code === '23505') {
        throw new ConflictException('This Brand is already exists.');
      }
      throw new InternalServerErrorException('Failed to update the Brand');
    }
  }

  async deleteBrand(brandData: DeleteBrandDTO) {
    try {
      const { brands } = this.ds.getSchema();
      const res = await this.db
        .delete(brands)
        .where(eq(brands.id, brandData.id));
      if (res.rowCount === 0) {
        throw new NotFoundException('Brand not found');
      }
    } catch (err: any) {
      this.logger.error('Error while deleting the Brand:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete the Brand');
    }
  }
}
