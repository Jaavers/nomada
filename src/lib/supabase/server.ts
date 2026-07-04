import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Route-handler client. Uses the publishable key, not a secret/service-role
// key: RLS's WITH CHECK on proyecto_dos.reservations already gates inserts,
// so a service-role key would only add risk without adding capability here.
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    db: { schema: "proyecto_dos" },
  });
}
