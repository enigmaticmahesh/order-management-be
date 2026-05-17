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
import { BrandDTO, DeleteBrandDTO, UpdateBrandDTO } from './brands.dto';
import { Brand } from './brands.interface';

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

  async getBrands(): Promise<Brand[]> {
    try {
      return this.db.query.brands.findMany();
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
