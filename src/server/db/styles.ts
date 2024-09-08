import { randomUUID } from 'crypto';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const genderChoices = ['male', 'female'] as const;

export const genderEnum = pgEnum('gender', genderChoices);

export const style = pgTable('style', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  coverPhotoUrl: text('coverPhotoUrl').notNull(),
  gender: genderEnum('gender').notNull(),
  description: text('description').notNull(),
});

export const prompt = pgTable('prompt', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => randomUUID()),
  inpaintPhotoUrl: text('inpaintPhotoUrl').notNull(),
  prompt: text('prompt').notNull(),
  styleId: text('styleId')
    .notNull()
    .references(() => style.id),
});
