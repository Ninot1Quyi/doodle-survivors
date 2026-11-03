import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const gameRuns = sqliteTable('game_runs', {
  id: text('id').primaryKey(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  activeMs: integer('active_ms').notNull().default(0),
});
export const gameTotals = sqliteTable('game_totals', {
  id: integer('id').primaryKey(),
  runs: integer('runs').notNull().default(0),
  activeMs: integer('active_ms').notNull().default(0),
  since: integer('since').notNull(),
});
