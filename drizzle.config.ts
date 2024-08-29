import { config } from "dotenv";
import { defineConfig } from 'drizzle-kit';

config({ path: ".env.local"});

export default defineConfig({
    schema: './db/schema.ts',
    out: "./drizzle/migrations",
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL as string
    },
    verbose: true,
    strict: true,
}); 