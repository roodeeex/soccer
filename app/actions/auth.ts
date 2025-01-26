"use server"

import { supabase } from "@/lib/supabase"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("Attempting to sign in with email:", email)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Supabase sign-in error:", error)
      return { error: error.message }
    }

    if (!data.user) {
      console.error("Sign-in failed: No user returned")
      return { error: "Sign-in failed. Please try again." }
    }

    console.log("Sign-in successful for user:", data.user.id)
    return { success: true, user: data.user }
  } catch (error) {
    console.error("Unexpected error during sign-in:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  await supabase.auth.signOut()
  return { success: true }
}

