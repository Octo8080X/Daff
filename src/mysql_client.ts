import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import type { ConnectionConfig } from "./interface.ts";

let client: null | Client = null;

export async function connectClient(
  connectionConfig: ConnectionConfig,
): Promise<Client> {
  if (!client) {
    client = await new Client().connect(connectionConfig);
  }
  return client;
}

export async function closeClient(): Promise<void> {
  await client?.close();
}

export async function getDataAll(
  dbName: string,
  limitTime: Date,
  ignoreTables: string[],
) {
  if (!client) throw "client not setup!";

  const tablesResult = await client.execute(`show tables`);
  console.log(ignoreTables);
  const tableNames = tablesResult.rows!.map((r) => r[`Tables_in_${dbName}`])
    .filter((r: string) => !ignoreTables.includes(r));

  console.log(tableNames);

  const data = {} as { [key: string]: any };

  for await (const tableName of tableNames) {
    data[tableName] = (
      await client.execute(
        `select * from ?? where created_at >= ? OR updated_at >= ?`,
        [tableName, limitTime, limitTime],
      )
    ).rows!;
  }

  return data;
}
