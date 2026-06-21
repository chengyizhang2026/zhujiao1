"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError("发送失败，请检查邮箱地址是否正确")
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">助教智能体</h1>
          <p className="text-sm text-gray-500 mt-1">AI驱动的中学学习助手</p>
        </div>

        {/* Login Form */}
        {!sent ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-center text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "发送中..." : "发送魔法链接"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">链接已发送！</h2>
            <p className="text-sm text-gray-500">
              请查看 <strong>{email}</strong> 的收件箱，点击邮件中的链接登录
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-indigo-600 hover:underline mt-4"
            >
              使用其他邮箱
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
