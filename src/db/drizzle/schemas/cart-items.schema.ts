import { integer, pgTable, serial, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { products } from "./products.schema";
import { relations } from "drizzle-orm";

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id, {
    onDelete: 'cascade'
  }).notNull(),
  prodId: integer('prod_id').references(() => products.id, {
    onDelete: 'cascade'
  }).notNull(),
  qty: integer('qty').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  // 2. Automatically updates the timestamp on your server whenever the row is updated
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => [
  unique('user_product_unique').on(table.userId, table.prodId)
])

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.prodId],
    references: [products.id]
  }),
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id]
  })
}))
