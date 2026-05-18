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
import { DeleteSubCatDTO, SubCatDTO, UpdateSubCatDTO } from './subcat.dto';
import { SubCat } from './subcat.interface';

@Injectable()
export class SubcategoriesService {
  private logger = new Logger(SubcategoriesService.name);
  constructor(private readonly ds: DrizzleService) {}

  private get db() {
    return this.ds.getDb();
  }

  async createSubCat(subCatData: SubCatDTO) {
    try {
      const { subCats } = this.ds.getSchema();
      const newSubCat: SubCat = subCatData;
      await this.db.insert(subCats).values(newSubCat);
    } catch (err: any) {
      this.logger.error('Error while creating a new sub category:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This sub category is already exists.');
      }
      throw new InternalServerErrorException('Failed to create sub category');
    }
  }

  async getSubCats(): Promise<SubCat[]> {
    try {
      return this.db.query.subCats.findMany();
    } catch (err) {
      this.logger.error('Error while fetching Sub Categories:', err);
      throw new InternalServerErrorException('Failed to fetch Sub Categories');
    }
  }

  async updateSubCat(subCatData: UpdateSubCatDTO) {
    try {
      const { subCats } = this.ds.getSchema();
      const { id, ...newSubCat } = subCatData;
      const [updatedSubCat] = await this.db
        .update(subCats)
        .set(newSubCat)
        .where(eq(subCats.id, id))
        .returning();
      if (!updatedSubCat) {
        throw new NotFoundException('Sub Category not found');
      }
    } catch (err: any) {
      this.logger.error('Error while updating the Sub Category:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.cause.code === '23505') {
        throw new ConflictException('This Sub Category is already exists.');
      }
      throw new InternalServerErrorException(
        'Failed to update the Sub Category',
      );
    }
  }

  async deleteSubCat(subCatData: DeleteSubCatDTO) {
    try {
      const { subCats } = this.ds.getSchema();
      const res = await this.db
        .delete(subCats)
        .where(eq(subCats.id, subCatData.id));
      if (res.rowCount === 0) {
        throw new NotFoundException('Sub Category not found');
      }
    } catch (err: any) {
      this.logger.error('Error while deleting the Sub Category:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Failed to delete the Sub Category',
      );
    }
  }
}
