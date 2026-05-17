import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { products } from './products.schema';

export const hsnCodes = pgTable('hsn_codes', {
  id: serial('id').primaryKey(),
  code: varchar({ length: 255 }).notNull().unique(),
  sgst: decimal({ precision: 10, scale: 2 }).notNull(), // Drizzle saves this as a string in the DB
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  // 2. Automatically updates the timestamp on your server whenever the row is updated
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const hsnCodeRelations = relations(hsnCodes, ({ many }) => ({
  products: many(products),
}));
