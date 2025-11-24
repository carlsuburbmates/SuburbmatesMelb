import "./env";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

let adminClient: SupabaseClient<Database> | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function ensureEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (!adminClient) {
    adminClient = createClient<Database>(
      ensureEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
      ensureEnv(serviceRoleKey, "SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return adminClient;
}

export function createSupabaseAnonClient(): SupabaseClient<Database> {
  return createClient<Database>(
    ensureEnv(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    ensureEnv(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}
