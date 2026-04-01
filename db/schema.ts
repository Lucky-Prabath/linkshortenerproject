import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const link = pgTable('link', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  shortCode: text('short_code').unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Link = typeof link.$inferSelect;
export type NewLink = typeof link.$inferInsert;
