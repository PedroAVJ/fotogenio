import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/server/db/catalogos',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env['CATALOGOS_SAT_DATABASE_URL'] ?? '',
  },
});
