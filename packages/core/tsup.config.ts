import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  skipNodeModulesBundle: true,
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: "./src/index.ts",
  clean: true,
  minify: true,
  banner: {
    js: '"use client";',
  },
});
