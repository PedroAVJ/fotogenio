import { randomUUID } from 'crypto';
import { pgTable, text, unique } from 'drizzle-orm/pg-core';

import { style } from './styles';

export const chosenStyles = pgTable(
  'chosen_styles',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$default(() => randomUUID()),
    userId: text('userId').notNull(),
    styleId: text('styleId')
      .notNull()
      .references(() => style.id),
  },
  (table) => ({
    unique: unique().on(table.userId, table.styleId),
  }),
);
