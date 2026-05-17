import { DrizzleService } from '@/db/drizzle/drizzle.service';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { UserWithRole } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly ds: DrizzleService) {}
  private get db() {
    return this.ds.getDb();
  }

  async findUserByEmail(email: string): Promise<UserWithRole | undefined> {
    const user = await this.db.query.users.findFirst({
      where: (user) => eq(user.email, email),
      with: {
        role: true,
      },
    });
    return user;
  }

  async findUserById(uid: string): Promise<UserWithRole | undefined> {
    const user = await this.db.query.users.findFirst({
      where: (user) => eq(user.id, uid),
      with: {
        role: true,
      },
    });
    return user;
  }
}

// The types returned by 'getSQL()' are incompatible between these types.
// Type
// 'import("/Users/mahesh/Documents/Projects/order-management/order-management-be/node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_pg@8.20.0/node_modules/drizzle-orm/sql/sql").SQL<unknown>'
// is not assignable to type
// 'import("/Users/mahesh/Documents/Projects/order-management/order-management-be/node_modules/.pnpm/drizzle-orm@0.45.2_@types+pg@8.20.0_pg@8.20.0/node_modules/drizzle-orm/sql/sql", { with: { "resolution-mode": "import" } }).SQL<unknown>'.
