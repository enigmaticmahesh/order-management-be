import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { products } from './products.schema';

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  // 2. Automatically updates the timestamp on your server whenever the row is updated
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const brandRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));
