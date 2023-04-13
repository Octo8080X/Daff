import type { ConnectionConfig } from "./interface.ts";
import * as mysqlClient from "./mysql_client.ts";
import * as postgresClient from "./postgres_client.ts";

export class SqlClient {
  private clientType: string;
  constructor(clientType: string) {
    this.clientType = clientType;
  }
  async connectClient(connectionConfig: ConnectionConfig) {
    if (!this.clientType) throw ("Net set connectionConfig!!");
    if (this.clientType === "mysql") {
      await mysqlClient.connectClient(connectionConfig);
      return;
    }
    await postgresClient.connectClient(connectionConfig);
  }

  async getDataAll(dbName: string, limitTime: Date, ignoreTables: string[]) {
    if (this.clientType === "mysql") {
      return await mysqlClient.getDataAll(dbName, limitTime, ignoreTables);
    }
    return await postgresClient.getDataAll(limitTime, ignoreTables);
  }

  async closeClient(): Promise<void> {
    if (this.clientType === "mysql") {
      await mysqlClient.closeClient();
      return;
    }
    await postgresClient.closeClient();
  }
}
