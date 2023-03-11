export interface ConnectionConfig {
  hostname: string;
  port: number;
  username: string;
  password: string;
  db: string;
}

export interface ValidateResultHelpSuccess {
  success: true;
  mode: "-h";
}

export interface ValidateResultBaseSuccess {
  success: true;
  mode: "base";
  clientType: "mysql"|"postgres"
  connectionConfig: ConnectionConfig;
  limitTime: Date;
}

export interface ValidateResultDiffSuccess {
  success: true;
  mode: "diff";
  clientType: "mysql"|"postgres"
  connectionConfig: ConnectionConfig;
  limitTime: Date;
}

export interface ValidateResultFailure {
  success: false;
  errors: string[];
}

export type ValidateResult =
  | ValidateResultHelpSuccess
  | ValidateResultDiffSuccess
  | ValidateResultBaseSuccess
  | ValidateResultFailure;
