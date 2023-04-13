import type { ConnectionConfig } from "./interface.ts";
import { SqlClient } from "./client.ts";
import { exportFileName } from "./const.ts";
import { diffString } from "npm:json-diff";

export async function diff(
  clientType: string,
  connectionConfig: ConnectionConfig,
  limitTime: Date,
): Promise<void> {
  console.log("%cDaff start...", "color: green; font-weight: bold");

  const sqlClient = new SqlClient(clientType);
  try {
    await sqlClient.connectClient(connectionConfig);
    const latestData = await sqlClient.getDataAll(
      connectionConfig.db,
      limitTime,
      connectionConfig.ignoreTables,
    );

    const compareData = JSON.parse(Deno.readTextFileSync(exportFileName));

    let colums: string[] = [];

    for (const table of Object.keys(compareData)) {
      compareData[table].forEach((r: { [key: string]: string }) => {
        colums = [...colums, ...Object.keys(r)];
      });
    }

    for (const table of Object.keys(latestData)) {
      latestData[table].forEach((r: { [key: string]: string }) => {
        colums = [...colums, ...Object.keys(r)];
      });
    }

    const r = diffString(compareData, JSON.parse(JSON.stringify(latestData)), {
      outputKeys: colums,
      full: false,
      deltas: true,
    }).replace(/^(\s)+(\.)+\n/gim, "");

    console.log(r);
  } finally {
    await sqlClient.closeClient();
  }
}
