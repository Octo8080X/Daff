import type { ConnectionConfig } from "./interface.ts";
import { SqlClient } from "./client.ts";
import { exportFileName } from "./const.ts";

export async function base(
  clientType: string,
  connectionConfig: ConnectionConfig,
  limitTime: Date,
): Promise<void> {
  console.log("%cDaff start...", "color: green; font-weight: bold");
  console.log(
    `%cIgnore tables [${connectionConfig.ignoreTables}]`,
    "color: green; font-weight: bold",
  );

  const sqlClient = new SqlClient(clientType);
  try {
    await sqlClient.connectClient(connectionConfig);
    const data = await sqlClient.getDataAll(
      connectionConfig.db,
      limitTime,
      connectionConfig.ignoreTables,
    );

    Deno.writeTextFileSync(exportFileName, JSON.stringify(data, null, " "));
    console.log(
      `%cCreate Files ${exportFileName} compared`,
      "color: green; font-weight: bold",
    );
  } finally {
    await sqlClient.closeClient();
  }
}
