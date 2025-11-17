#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

if (!process.env.DISABLE_RATE_LIMIT) {
  process.env.DISABLE_RATE_LIMIT = "true";
}

const port = process.env.PORT || "3010";
const baseUrl = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;
const appDir = process.cwd();
const nextBin = path.join(
  appDir,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);

function checkReady(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkReady(url)) return true;
    await delay(400);
  }
  return false;
}

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", ...options });
    child.on("close", (code) =>
      code === 0
        ? resolve(0)
        : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`))
    );
  });
}

(async () => {
  // Preflight: ensure workspace is correct
  const pkgPath = path.join(appDir, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error(
      `Workspace error: missing package.json at ${pkgPath}.\n` +
        `Ensure you are running from the project root (e.g., /Users/carlg/Documents/PROJECTS/Rovodev Projects/sm).`
    );
    process.exit(1);
  }
  if (!fs.existsSync(nextBin)) {
    console.error(
      `Workspace error: Next.js binary not found at ${nextBin}.\n` +
        `Try: npm install`
    );
    process.exit(1);
  }
  // Ensure browsers are installed
  await run("npx", ["playwright", "install", "chromium"]);

  // Build fresh to keep chunk hashes and manifest in sync
  await run("npm", ["run", "build"]);

  // Start server in background
  const server = spawn(
    process.execPath,
    [nextBin, "start", "-p", String(port), "-H", "localhost"],
    {
      cwd: appDir,
      stdio: "ignore",
      detached: true,
      env: process.env,
    }
  );
  const pid = server.pid;
  console.log(`Started Next.js server pid=${pid} on ${baseUrl}`);

  // Ensure we clean up child group on exit
  const cleanup = () => {
    try {
      process.kill(-pid);
    } catch {}
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  const ready = await waitForServer(baseUrl);
  if (!ready) {
    try {
      process.kill(pid);
    } catch {}
    throw new Error("Server failed to become ready in time");
  }

  try {
    await run("npx", ["playwright", "test"], {
      env: { ...process.env, PLAYWRIGHT_BASE_URL: baseUrl },
    });
  } finally {
    try {
      process.kill(-pid);
      console.log(`Stopped Next.js server pid=${pid}`);
    } catch {}
  }
})();
