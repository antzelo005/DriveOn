import { spawnSync } from "node:child_process";
const result = spawnSync(
  process.execPath,
  ["node_modules/@playwright/test/cli.js", "test", "--project=firefox"],
  { stdio: "inherit", env: { ...process.env, TEST_FIREFOX: "1" } },
);
process.exit(result.status ?? 1);
