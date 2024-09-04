import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/control/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['SUPABASE_DB_URL'] ?? '',
  },
});
