import { relations } from 'drizzle-orm';

import { chosenStyles } from './chosen-styles';
import { prompt, style } from './styles';
import { generatedPhotos } from './users';

export const styleRelations = relations(style, ({ many }) => ({
  prompts: many(prompt),
}));

export const promptRelations = relations(prompt, ({ one }) => ({
  style: one(style, {
    fields: [prompt.styleId],
    references: [style.id],
  }),
}));

export const chosenStylesRelations = relations(chosenStyles, ({ one }) => ({
  style: one(style, {
    fields: [chosenStyles.styleId],
    references: [style.id],
  }),
}));

export const generatedPhotosRelations = relations(
  generatedPhotos,
  ({ one }) => ({
    prompt: one(prompt, {
      fields: [generatedPhotos.promptId],
      references: [prompt.id],
    }),
  }),
);
