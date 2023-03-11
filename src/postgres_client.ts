import postgres from "https://deno.land/x/postgresjs/mod.js";
import type { ConnectionConfig } from "./interface.ts";

let sql: null | any = null;

export function connectClient(
  connectionConfig: ConnectionConfig,
): void {
  if (!sql) {
    sql = postgres(connectionConfig);
  }
}

export async function closeClient(): Promise<void> {
  await sql?.close();
}

export async function getDataAll(
  limitTime: Date,
) {
  if (!sql) throw "client not setup!";

  const tablesResult = await sql`select schemaname, tablename, tableowner from pg_tables where schemaname = 'public'`;
  const tableNames = tablesResult.map((r:any) => r.tablename);
  const data = {} as { [key: string]: any };

  for await (const tableName of tableNames) {
    data[tableName] = await sql`select * from ${sql(tableName)} where created_at >= ${limitTime} OR updated_at >= ${limitTime}`
  }

  return data;
}
