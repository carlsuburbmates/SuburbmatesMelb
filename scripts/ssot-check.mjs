import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const BANNED_PHRASE_PATTERN =
  "join hundreds|trusted by|already using|dozens of automations|annual subscription|business directory|Secure transaction via SuburbMates|certified local expert|verified creator";

const SOURCE_COPY_PATHS = ["src/app", "src/components"];

const DB_CRON_AUTHORITY_FILE =
  "supabase/migrations/20260412_automation_jobs.sql";

const REQUIRED_DB_CRON_JOBS = [
  "expire-featured-slots",
  "featured-reminders",
  "broken-links-check",
  "incomplete-listings-nudge",
];

const failures = [];

function runRg(pattern, targets) {
  try {
    const output = execFileSync("rg", ["-n", pattern, ...targets], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { found: true, output: output.trim() };
  } catch (error) {
    if (error.status === 1) {
      return { found: false, output: "" };
    }
    throw error;
  }
}

function checkBannedPhrasesInSourceCopy() {
  const result = runRg(BANNED_PHRASE_PATTERN, SOURCE_COPY_PATHS);
  if (result.found) {
    failures.push(
      [
        "[SSOT] Banned phrases found in source copy scope:",
        ...result.output.split("\n"),
      ].join("\n"),
    );
  }
}

function checkSchedulerAuthority() {
  const vercelJson = JSON.parse(readFileSync("vercel.json", "utf8"));
  if (Array.isArray(vercelJson.crons) && vercelJson.crons.length > 0) {
    failures.push(
      "[Scheduler] DB cron is authoritative, but vercel.json still defines cron jobs.",
    );
  }

  const migrationSql = readFileSync(DB_CRON_AUTHORITY_FILE, "utf8");
  for (const jobName of REQUIRED_DB_CRON_JOBS) {
    if (!migrationSql.includes(`'${jobName}'`)) {
      failures.push(
        `[Scheduler] Missing authoritative DB cron job definition: ${jobName}`,
      );
    }
  }
}

function printScopeRules() {
  console.log("[Scope] Source copy scan paths:", SOURCE_COPY_PATHS.join(", "));
  console.log(
    "[Scope] Docs are excluded from banned-phrase scanning because governance and archive docs intentionally quote banned text as policy warnings/evidence.",
  );
}

function main() {
  printScopeRules();
  checkBannedPhrasesInSourceCopy();
  checkSchedulerAuthority();

  if (failures.length > 0) {
    console.error("\nSSOT check failed:\n");
    for (const failure of failures) {
      console.error(failure);
      console.error("");
    }
    process.exit(1);
  }

  console.log("SSOT Compliance Verified");
}

main();
