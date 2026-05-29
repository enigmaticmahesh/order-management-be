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
import { Category, CatsListResponse } from './category.interface';
import {
  CategoryDTO,
  DeleteCategoryDTO,
  PaginatedCategoriesQueryDTO,
  UpdateCategoryDTO,
} from './categories.dto';
import { DBQueryConfig } from 'drizzle-orm';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);
  constructor(private readonly ds: DrizzleService) {}

  private get db() {
    return this.ds.getDb();
  }

  async createCategory(catData: CategoryDTO) {
    try {
      const { categories } = this.ds.getSchema();
      const newCat: Category = { name: catData.name };
      await this.db.insert(categories).values(newCat);
    } catch (err: any) {
      this.logger.error('Error while creating a new category:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This category is already exists.');
      }
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  private _getConfig(query: PaginatedCategoriesQueryDTO): DBQueryConfig {
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

  private _catsListResponse(
    fetchedCats: Category[],
    query: PaginatedCategoriesQueryDTO,
  ): CatsListResponse {
    const hasMore = fetchedCats.length > query.limit;
    const responseData: CatsListResponse = {
      nextID: 0,
      firstID: 0,
      hasNext: false,
      hasPrev: false,
      categories: fetchedCats,
    };

    fetchedCats = fetchedCats.slice(0, query.limit); // Remove the extra row that we fetched to detect if there are more rows

    // 2. Because moving backward (before) forces an ASC sort, the DB returns records reversed.
    // We reverse them back to descending chronological order to maintain consistent presentation.
    if (query.dir === 'prev') {
      fetchedCats = fetchedCats.reverse();
    }

    if (fetchedCats.length > 0) {
      responseData.nextID = fetchedCats[fetchedCats.length - 1].id!;
      responseData.firstID = fetchedCats[0].id!;
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

    responseData.categories = fetchedCats;
    return responseData;
  }

  async getCategories(
    query: PaginatedCategoriesQueryDTO,
  ): Promise<CatsListResponse> {
    try {
      const conditions: DBQueryConfig = this._getConfig(query);
      const fetchedCats = await this.db.query.categories.findMany(conditions);
      const responseData = this._catsListResponse(fetchedCats, query);

      return responseData;
    } catch (err) {
      this.logger.error('Error while fetching Categories:', err);
      throw new InternalServerErrorException('Failed to fetch Categories');
    }
  }

  async updateCategory(catData: UpdateCategoryDTO) {
    try {
      const { categories } = this.ds.getSchema();
      const newCat: Category = { name: catData.name };
      const [updatedCat] = await this.db
        .update(categories)
        .set(newCat)
        .where(eq(categories.id, catData.id))
        .returning();
      if (!updatedCat) {
        throw new NotFoundException('Category not found');
      }
    } catch (err: any) {
      this.logger.error('Error while updating the Category:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.cause.code === '23505') {
        throw new ConflictException('This Category is already exists.');
      }
      throw new InternalServerErrorException('Failed to update the Category');
    }
  }

  async deleteCategory(catData: DeleteCategoryDTO) {
    try {
      const { categories } = this.ds.getSchema();
      const res = await this.db
        .delete(categories)
        .where(eq(categories.id, catData.id));
      if (res.rowCount === 0) {
        throw new NotFoundException('Category not found');
      }
    } catch (err: any) {
      this.logger.error('Error while deleting the Category:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete the Category');
    }
  }
}
