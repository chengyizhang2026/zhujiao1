import Link from "next/link"
import { GraduationCap, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">助教智能体</h1>
          <p className="text-base text-gray-500 mt-2">
            AI驱动的中学学习助手
          </p>
          <p className="text-sm text-gray-400 mt-4 max-w-xs mx-auto">
            每日推送学习内容 · 思维导图 · 智能练习 · 错题追踪 · 举一反三
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
        >
          开始使用
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
