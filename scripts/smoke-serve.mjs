#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.join(__dirname, "..");
const port = process.env.PORT || "3010";
const baseUrl = process.env.SM_BASE_URL || `http://localhost:${port}`;
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

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await checkReady(url)) return true;
    await delay(300);
  }
  return false;
}

function runNode(args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, options);
    child.stdout?.on("data", (d) => process.stdout.write(d));
    child.stderr?.on("data", (d) => process.stderr.write(d));
    child.on("close", (code) => {
      if (code === 0) resolve(0);
      else reject(new Error(`Process exited with code ${code}`));
    });
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
  // Start server as a detached process group, invoking next directly
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
  process.stdout.write(`Started Next.js server pid=${pid} on ${baseUrl}\n`);

  // Ensure we clean up child group on exit
  const cleanup = () => {
    try {
      // Kill the entire process group to avoid orphaned children
      process.kill(-pid);
    } catch {}
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  // Give it a moment to boot and wait for readiness
  await delay(400);
  const ready = await waitForServer(baseUrl);
  if (!ready) {
    try {
      process.kill(pid);
    } catch {}
    throw new Error("Server failed to become ready in time");
  }

  // Run smoke tests at repo root
  try {
    await runNode(["scripts/smoke-test-api.mjs"], {
      cwd: appDir,
      env: { ...process.env, SM_BASE_URL: baseUrl },
    });
  } finally {
    // Stop server (entire group)
    try {
      process.kill(-pid);
      process.stdout.write(`Stopped Next.js server pid=${pid}\n`);
    } catch {}
  }
})();
