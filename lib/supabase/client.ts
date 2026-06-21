// ============================================================
// Supabase 客户端 — 浏览器端
// ============================================================

import { createBrowserClient } from "@supabase/ssr"

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (clientInstance) return clientInstance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // 在构建时可能不可用，返回一个 mock 以避免构建失败
    if (typeof window === "undefined") {
      return createBrowserClient(
        "https://placeholder.supabase.co",
        "placeholder-key"
      )
    }
    throw new Error("Supabase URL and Anon Key are required")
  }

  clientInstance = createBrowserClient(url, key)
  return clientInstance
}
