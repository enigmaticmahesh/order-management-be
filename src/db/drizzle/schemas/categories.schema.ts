import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { subCats } from './subcats.schema';

export const categories = pgTable('categories', {
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

// Category perspective relation goes here
export const categoriesRelations = relations(categories, ({ many }) => ({
  subCats: many(subCats),
}));
