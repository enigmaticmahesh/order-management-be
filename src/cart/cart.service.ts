import { DrizzleService } from '@/db/drizzle/drizzle.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  constructor(
    private readonly ds: DrizzleService,
  ) { }

  private get db() {
    return this.ds.getDb();
  }

  async createCartItems() { }
}
