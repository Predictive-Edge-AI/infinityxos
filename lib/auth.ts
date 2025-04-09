import { createServerClient } from "./supabase"

export async function getUserSession() {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error.message)
      return null
    }

    return data.session
  } catch (error) {
    console.error("Unexpected error getting session:", error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error getting user profile:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Unexpected error getting user profile:", error)
    return null
  }
}

