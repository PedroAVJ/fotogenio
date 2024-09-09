import { defineConfig } from 'drizzle-kit';

const supabasePassword = process.env['SUPABASE_DB_PASSWORD'] ?? '';
const supabaseUrl = process.env['SUPABASE_DB_URL'] ?? '';

export default defineConfig({
  schema: [
    './src/server/db/relations.ts',
    './src/server/db/styles.ts',
    './src/server/db/users.ts',
    './src/server/db/chosen-styles.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: supabaseUrl.replace('[YOUR-PASSWORD]', supabasePassword),
  },
});
