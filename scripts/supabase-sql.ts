/**
 * Execute raw SQL against the remote Supabase project via Management API.
 * Usage: SUPABASE_ACCESS_TOKEN=$SUPABASE_REPLIT tsx scripts/supabase-sql.ts "<sql>"
 *        or import { runSQL } from './supabase-sql'
 */

const PROJECT_REF = 'hmmqhwnxylqcbffjffpj';

export async function runSQL(sql: string): Promise<unknown[]> {
  const token = process.env.SUPABASE_REPLIT || process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error('SUPABASE_REPLIT env var not set');

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const body = await res.json() as unknown;

  if (!res.ok) {
    throw new Error(`Supabase SQL error (${res.status}): ${JSON.stringify(body)}`);
  }

  return body as unknown[];
}

// CLI usage
const sql = process.argv[2];
if (sql) {
  runSQL(sql)
    .then(rows => console.log(JSON.stringify(rows, null, 2)))
    .catch(e => { console.error(e.message); process.exit(1); });
}
