import { build } from "tsup";
import { execSync } from "node:child_process";
import { mkdirSync, cpSync } from "node:fs";

// 1) Build backend
await build({
  entry: ["server/index.ts"],
  clean: true,
  outDir: "dist",
  format: ["cjs"],
});

// 2) Build frontend using Vite
console.log("Building frontend...");
execSync("vite build", { stdio: "inherit" });

// 3) Copy frontend dist to server dist/public
console.log("Copying frontend to dist/public...");
mkdirSync("dist/public", { recursive: true });
cpSync("public", "dist/public", { recursive: true });
cpSync("dist/client", "dist/public", { recursive: true });
