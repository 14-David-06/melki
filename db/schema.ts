import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const responses = sqliteTable('responses', {
 person: text('person').primaryKey(),
 votes: text('votes').notNull(),
 revision: integer('revision').notNull().default(1),
 updatedAt: text('updated_at').notNull(),
});
