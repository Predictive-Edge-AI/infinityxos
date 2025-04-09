import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// Create a singleton Supabase client for server-side use
let supabaseServerClient: ReturnType<typeof createClient<Database>> | null = null

export function getServerSupabaseClient() {
  if (!supabaseServerClient) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseServerClient = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return supabaseServerClient
}

// Create a singleton Supabase client for client-side use
let supabaseClientClient: ReturnType<typeof createClient<Database>> | null = null

export function getClientSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("getClientSupabaseClient should only be called on the client side")
  }

  if (!supabaseClientClient) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseClientClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storageKey: "ai-prophet-auth",
        },
      },
    )
  }

  return supabaseClientClient
}

