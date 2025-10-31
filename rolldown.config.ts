import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    cleanDir: true,
  },
  platform: "browser",
  tsconfig: "./tsconfig.json",
});
