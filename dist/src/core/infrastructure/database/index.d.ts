import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import * as schema from "./schema";
export declare const db: import("drizzle-orm/vercel-postgres").VercelPgDatabase<typeof schema> & {
    $client: import("drizzle-orm/vercel-postgres").VercelPgClient;
};
export declare const luciaAdapter: DrizzlePostgreSQLAdapter;
