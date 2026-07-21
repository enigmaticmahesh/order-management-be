// src/db/drizzle/schemas/users.ts
import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { roles } from './roles.schema';
import { relations } from 'drizzle-orm';
import { userProfiles } from './user-profile.schema';
import { cartItems } from './cart-items.schema';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar({ length: 150 }).unique().notNull(),
  password: text('password').notNull(), // Traditional bcrypt hash storage string
  roleId: integer('role_id')
    .references(() => roles.id, { onDelete: 'restrict' })
    .notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  // 2. Automatically updates the timestamp on your server whenever the row is updated
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// User perspective relation goes here
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  cartItems: many(cartItems)
}));
