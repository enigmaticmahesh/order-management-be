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
import { Category } from './category.interface';
import {
  CategoryDTO,
  DeleteCategoryDTO,
  UpdateCategoryDTO,
} from './categories.dto';

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

  async getCategories(): Promise<Category[]> {
    try {
      return this.db.query.categories.findMany();
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
