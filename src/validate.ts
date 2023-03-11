import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import type { ConnectionConfig, ValidateResult } from "./interface.ts";

function isConnectionConfig(obj: any): obj is ConnectionConfig {
  if (!obj) return false;
  if (!obj.hostname || typeof obj.hostname !== "string") return false;
  if (!obj.port || typeof obj.port !== "number") return false;
  if (!obj.username || typeof obj.username !== "string") return false;
  if (!obj.password || typeof obj.password !== "string") return false;
  if (!obj.db || typeof obj.db !== "string") return false;
  return true;
}

export function validate(args: string[]): ValidateResult {
  const [mode, clientType, configFileName, limitTimeStr] = args;

  let isError = false;
  const errors = [];

  if (
    !mode ||
    !z.string().safeParse(mode).success ||
    !mode.match(/^(-h|base|diff)$/)
  ) {
    errors.push("`mode' is /^(-h|base|diff)$/. ex: base");
    isError = true;
  }

  if (mode === "-h") {
    return { success: true, mode };
  }

  if (
    !clientType ||
    !z.string().safeParse(clientType).success ||
    !clientType.match(/^(mysql|postgres)$/)
  ) {
    errors.push("`clientType' is /^(mysql|postgres)$/. ex: mysql");
    isError = true;
  }

  if (
    !configFileName ||
    !z.string().safeParse(configFileName).success ||
    configFileName.match(/^.*[\\\\|/|:|\\*|?|\"|<|>|\\|].*$/) ||
    !configFileName.match(/^[a-zA-Z0-9_-]+.json$/)
  ) {
    errors.push("`configFileName` is file name. ex: hoge.json");
    isError = true;
  }

  let connectionConfigStr = null;
  let connectionConfig: null | ConnectionConfig = null;

  if (!isError) {
    try {
      connectionConfigStr = Deno.readTextFileSync(configFileName);
    } catch {
      errors.push(`Failure ${configFileName} read. Please confirm.`);
      isError = true;
    }
  }

  if (connectionConfigStr) {
    try {
      connectionConfig = JSON.parse(connectionConfigStr);
    } catch {
      errors.push(`Failure ${configFileName} json parse. Please confirm.`);
      isError = true;
    }
  }

  if (!limitTimeStr || !z.string().datetime().safeParse(limitTimeStr).success) {
    errors.push("limit date` is time. ex: 2023-03-01T00:00:00Z");
    isError = true;
  }

  const limitTime = new Date(limitTimeStr);

  if (!isConnectionConfig(connectionConfig)) {
    errors.push("Connection config is no params");
    isError = true;
  }

  if (isError) return { success: false, errors };
  return {
    success: true,
    mode,
    connectionConfig,
    limitTime,
    clientType
  } as ValidateResult;
}
