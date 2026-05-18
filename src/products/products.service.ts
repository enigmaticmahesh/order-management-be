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
  CreateProductDTO,
  DeleteProductDTO,
  UpdateProductDTO,
} from './products.dto';
import { Product } from './products.interface';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  constructor(private readonly ds: DrizzleService) {}

  private get db() {
    return this.ds.getDb();
  }

  async createProduct(productData: CreateProductDTO) {
    try {
      const { products } = this.ds.getSchema();
      await this.db.insert(products).values(productData);
    } catch (err: any) {
      this.logger.error('Error while creating a new product:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This product is already exists.');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      return this.db.query.products.findMany();
    } catch (err) {
      this.logger.error('Error while fetching Products:', err);
      throw new InternalServerErrorException('Failed to fetch Products');
    }
  }

  async updateProduct(productData: UpdateProductDTO) {
    try {
      const { products } = this.ds.getSchema();
      const { id, ...newProductData } = productData;
      const [updatedProduct] = await this.db
        .update(products)
        .set(newProductData)
        .where(eq(products.id, id))
        .returning();
      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }
    } catch (err: any) {
      this.logger.error('Error while updating the Product:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      if (err.cause.code === '23505') {
        throw new ConflictException('This Product is already exists.');
      }
      throw new InternalServerErrorException('Failed to update the Product');
    }
  }

  async deleteProduct(productData: DeleteProductDTO) {
    try {
      const { products } = this.ds.getSchema();
      const res = await this.db
        .delete(products)
        .where(eq(products.id, productData.id));
      if (res.rowCount === 0) {
        throw new NotFoundException('Product not found');
      }
    } catch (err: any) {
      this.logger.error('Error while deleting the Product:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete the Product');
    }
  }
}
