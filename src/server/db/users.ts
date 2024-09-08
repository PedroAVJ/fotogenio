import { randomUUID } from 'crypto';
import { integer, pgTable, text, unique } from 'drizzle-orm/pg-core';

import { genderEnum } from './styles';

export const userSettings = pgTable('user_settings', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  userId: text('userId').notNull().unique(),
  gender: genderEnum('gender').notNull(),
  credits: integer('credits').notNull(),
  pendingPhotos: integer('pendingPhotos').notNull(),
});

export const uploadedPhotos = pgTable('uploaded_photos', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  userId: text('userId').notNull(),
  photoUrl: text('photoUrl').notNull(),
});

export const generatedPhotos = pgTable(
  'generated_photos',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$default(() => randomUUID()),
    userId: text('userId').notNull(),
    photoUrl: text('photoUrl').notNull(),
    promptId: text('promptId').notNull(),
  },
  (table) => ({
    unique: unique().on(table.userId, table.promptId),
  }),
);
