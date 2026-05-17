import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { HsncodesModule } from './hsncodes/hsncodes.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { RolesModule } from './roles/roles.module';

export const MyModules = [
  AuthModule,
  UserModule,
  ProductsModule,
  BrandsModule,
  HsncodesModule,
  CategoriesModule,
  SubcategoriesModule,
  RolesModule,
];
