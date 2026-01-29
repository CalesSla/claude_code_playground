import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/src/db/schema';

const db = drizzle(process.env.DATABASE_URL!, { schema });

export { db };
export * from '@/src/db/schema';