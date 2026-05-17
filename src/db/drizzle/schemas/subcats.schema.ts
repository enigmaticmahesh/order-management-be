import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { categories } from './categories.schema';
import { relations } from 'drizzle-orm';
import { products } from './products.schema';

export const subCats = pgTable('sub_cats', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  catId: integer('cat_id')
    .references(() => categories.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  // 2. Automatically updates the timestamp on your server whenever the row is updated
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const subCatRelations = relations(subCats, ({ one, many }) => ({
  // A sub category belongs to ONE category
  category: one(categories, {
    fields: [subCats.catId],
    references: [categories.id],
  }),
  products: many(products),
}));
