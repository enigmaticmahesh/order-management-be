import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { subCats } from './subcats.schema';
import { hsnCodes } from './hsn-codes.scheam';
import { brands } from './brands.schema';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  mrp: decimal({ precision: 5, scale: 2 }).notNull(),
  price: decimal({ precision: 5, scale: 2 }).notNull(),
  qty: integer('qty').notNull(),
  mfD: date('manufactured_date', { mode: 'string' }).notNull(),
  expD: date('expiry_date', { mode: 'string' }).notNull(),
  sku: varchar({ length: 255 }).notNull().unique(),
  barCode: varchar('bar_code', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  hsnId: integer('hsn_id')
    .references(() => hsnCodes.id, { onDelete: 'restrict' })
    .notNull(),
  brandId: integer('brand_id')
    .references(() => brands.id, { onDelete: 'restrict' })
    .notNull(),
  subcatId: integer('subcat_id')
    .references(() => subCats.id, { onDelete: 'restrict' })
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

export const productRelations = relations(products, ({ one }) => ({
  // A product has ONE hsn code
  hsnCode: one(hsnCodes, {
    fields: [products.hsnId],
    references: [hsnCodes.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  subCat: one(subCats, {
    fields: [products.subcatId],
    references: [subCats.id],
  }),
}));
