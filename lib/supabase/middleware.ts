import { createServerSupabase } from "./server"

export async function getSession() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUser() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.auth.getUser()
  return data.user
}
