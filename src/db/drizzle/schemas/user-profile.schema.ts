import { pgTable, serial, varchar, uuid, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';

export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  name: varchar({ length: 150 }).notNull(), // e.g., 'admin', 'customer', 'manager'
  userId: uuid('role_id')
    .unique()
    .references(() => users.id, { onDelete: 'cascade' })
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

// Profile perspective relation goes here
export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));
