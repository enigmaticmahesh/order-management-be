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
  CreateProductDTO,
  DeleteProductDTO,
  PaginatedProductsQueryDTO,
  ProductURLDTO,
  UpdateProductDTO,
} from './products.dto';
import {
  ProductsListResponse,
  ProductWithLevelOneRelation,
} from './products.interface';
import { DBQueryConfig } from 'drizzle-orm';
import ImageKitService from '@/sharedcore/services/file-uploader/ImageKit.service';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);
  constructor(
    private readonly ds: DrizzleService,
    private readonly imgKitService: ImageKitService,
  ) {}

  private get db() {
    return this.ds.getDb();
  }

  async createProduct(productData: CreateProductDTO) {
    try {
      const { products } = this.ds.getSchema();
      const [product] = await this.db
        .insert(products)
        .values(productData)
        .returning();
      return product;
    } catch (err: any) {
      this.logger.error('Error while creating a new product:', err);
      if (err.cause.code === '23505') {
        throw new ConflictException('This product is already exists.');
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  private _getConfig(query: PaginatedProductsQueryDTO): DBQueryConfig {
    const defaultConfig: DBQueryConfig = {
      where: (product) => {
        return and(
          query.cursor ? lt(product.id, query.cursor) : undefined,
          query.name ? ilike(product.name, `%${query.name}%`) : undefined,
          query.barCode
            ? ilike(product.barCode, `%${query.barCode}%`)
            : undefined,
          query.sku ? ilike(product.sku, `%${query.sku}%`) : undefined,
          query.hsnId ? eq(product.hsnId, query.hsnId) : undefined,
          query.brandId ? eq(product.brandId, query.brandId) : undefined,
          query.subcatId ? eq(product.subcatId, query.subcatId) : undefined,
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
          query.name ? ilike(brand.name, `%${query.name}%`) : undefined,
        );
      };
      defaultConfig.orderBy = (brands, { asc }) => asc(brands.id);
    }
    return defaultConfig;
  }

  private _prodsListResponse(
    fetchedProds: ProductWithLevelOneRelation[],
    query: PaginatedProductsQueryDTO,
  ): ProductsListResponse {
    const hasMore = fetchedProds.length > query.limit;
    const responseData: ProductsListResponse = {
      nextID: 0,
      firstID: 0,
      hasNext: false,
      hasPrev: false,
      products: fetchedProds,
    };

    fetchedProds = fetchedProds.slice(0, query.limit); // Remove the extra row that we fetched to detect if there are more rows

    // 2. Because moving backward (before) forces an ASC sort, the DB returns records reversed.
    // We reverse them back to descending chronological order to maintain consistent presentation.
    if (query.dir === 'prev') {
      fetchedProds = fetchedProds.reverse();
    }

    if (fetchedProds.length > 0) {
      responseData.nextID = fetchedProds[fetchedProds.length - 1].id!;
      responseData.firstID = fetchedProds[0].id!;
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

    responseData.products = fetchedProds;
    return responseData;
  }

  async getProducts(
    query: PaginatedProductsQueryDTO,
  ): Promise<ProductsListResponse> {
    try {
      const conditions: DBQueryConfig = this._getConfig(query);
      const fetchedProds = await this.db.query.products.findMany({
        ...conditions,
        with: {
          hsnCode: {
            columns: {
              id: true,
              code: true,
            },
          },
          brand: {
            columns: {
              id: true,
              name: true,
            },
          },
          subCat: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
      const responseData = this._prodsListResponse(fetchedProds, query);

      return responseData;
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

      await this.db.transaction(async (tx) => {
        const res = await tx
          .delete(products)
          .where(eq(products.id, productData.id))
          .returning({ sku: products.sku, id: products.id });

        if (res.length === 0) {
          throw new NotFoundException('Product not found');
        }

        const [{ sku, id }] = res;
        const folderPath = `/products/product_${sku}_${id}`;
        await this.imgKitService.deleteFolder(folderPath);
      });
    } catch (err: any) {
      this.logger.error('Error while deleting the Product:', err);

      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete the Product');
    }
  }

  generateProductImgUploadURLs(data: ProductURLDTO) {
    const urlsData = this.imgKitService.generateSignedURLs(data.count);
    return urlsData;
  }

  async getFilesCount(folderPath: string) {
    try {
      return await this.imgKitService.filesCountOfFolder(folderPath);
    } catch (err) {
      this.logger.error('Unable to fetch the files count from ImageKit', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to get the files count');
    }
  }

  async deleteProductImages(fileIds: string[]) {
    try {
      return await this.imgKitService.deleteFiles(fileIds);
    } catch (err) {
      this.logger.error('Unable to delete the files from ImageKit', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to delete files');
    }
  }
}
