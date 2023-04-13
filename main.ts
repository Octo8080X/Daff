import { validate } from "./src/validate.ts";
import { help } from "./src/help.ts";
import { base } from "./src/base.ts";
import { diff } from "./src/diff.ts";

const result = validate(Deno.args);

if (!result.success) {
  console.log(
    `%cERROR\n${result.errors.map((s, i) => `  E${i}. ${s}`).join("\n")}`,
    "color: red; font-weight: bold",
  );
  Deno.exit();
}

switch (result.mode) {
  case "-h":
    help();
    break;
  case "base":
    base(result.clientType, result.connectionConfig, result.limitTime);
    break;
  case "diff":
    diff(result.clientType, result.connectionConfig, result.limitTime);
    break;
}
