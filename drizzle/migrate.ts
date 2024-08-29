import "dotenv/config"
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';


const migrationClient = postgres("postgresql://postgres:hellotechno@localhost:5432/postgres", { max: 1 });

async function main() {
    await migrate(drizzle(migrationClient), {
        migrationsFolder: './migrations',
    });

    await migrationClient.end();
}

main();