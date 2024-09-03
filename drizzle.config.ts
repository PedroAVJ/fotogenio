import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/control/schema/*',
  out: './src/db/control/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env['TURSO_PARENT_DB_URL'] ?? '',
    authToken: process.env['TURSO_PARENT_AUTH_TOKEN'] ?? '',
  },
});
