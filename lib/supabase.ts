import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side only admin client
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (typeof window === 'undefined') {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  if (supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
}

export { supabaseAdmin };

// Types for database tables
export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_logo_url: string | null;
  category: string;
  location: string | null;
  year: number | null;
  purpose: string | null;
  services: string[] | null;
  description: string | null;
  full_description: string | null;
  cloudflare_stream_id: string;
  cloudflare_stream_url: string | null;
  cloudflare_thumbnail_url: string | null;
  additional_images: string[] | null;
  thumbnail_url: string;
  featured: number;
  coming_soon: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  service_package: string;
  deposit_amount: number;
  final_amount: number | null;
  status: string;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}