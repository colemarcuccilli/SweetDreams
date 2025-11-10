import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton instance to prevent multiple clients
let client: SupabaseClient | null = null;

export const createClient = () => {
  // Return existing client if already created
  if (client) {
    return client;
  }

  // Create new client only if one doesn't exist
  client = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );

  return client;
};
