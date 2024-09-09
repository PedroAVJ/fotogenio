import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: [
    './src/server/db/relations.ts',
    './src/server/db/styles.ts',
    './src/server/db/users.ts',
    './src/server/db/chosen-styles.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['SUPABASE_DB_URL'] ?? '',
  },
});
