"use client"

import { MATH_CHAPTERS } from "@/lib/constants"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, ChevronRight, Play, Database, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

// 模拟学习进度数据（后续会从数据库读取）
const mockProgress: Record<string, string[]> = {
  "math-01": ["生活中的立体图形"],
  "math-02": ["正数和负数", "数轴", "相反数"],
}

export default function ChapterDetailPage() {
  const params = useParams<{ chapterId: string }>()
  const router = useRouter()
  const chapter = MATH_CHAPTERS.find((c) => c.id === params.chapterId)

  if (!chapter) {
    return (
      <div className="p-4 pt-12 text-center">
        <p className="text-gray-500">章节未找到</p>
        <Link href="/math" className="text-indigo-600 text-sm mt-2 block">返回</Link>
      </div>
    )
  }

  const mastered = mockProgress[chapter.id] || []

  return (
    <div className="p-4 space-y-4">
      {/* 顶部 */}
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{chapter.title}</h1>
          <p className="text-xs text-gray-400">
            共 {chapter.knowledgePoints.length} 个知识点 · 已掌握 {mastered.length} 个
          </p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>学习进度</span>
          <span>{Math.round((mastered.length / chapter.knowledgePoints.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(mastered.length / chapter.knowledgePoints.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 知识点列表 */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">知识点</h2>
        {chapter.knowledgePoints.map((kp, index) => {
          const isMastered = mastered.includes(kp)
          const isUnlocked =
            index === 0 || mastered.includes(chapter.knowledgePoints[index - 1])
          const isCurrent = isUnlocked && !isMastered

          return (
            <div
              key={kp}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-indigo-50 border-indigo-200"
                  : isMastered
                  ? "bg-white border-gray-100"
                  : "bg-white border-gray-100 opacity-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isMastered
                    ? "bg-green-100"
                    : isCurrent
                    ? "bg-indigo-100"
                    : "bg-gray-100"
                }`}
              >
                {isMastered ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : isCurrent ? (
                  <Database className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isCurrent ? "text-indigo-900" : "text-gray-700"
                  }`}
                >
                  {kp}
                </p>
                {isCurrent && (
                  <p className="text-xs text-indigo-500">当前可学习</p>
                )}
              </div>
              {isCurrent && (
                <button
                  onClick={() =>
                    router.push(
                      `/math/learn?chapter=${chapter.id}&kp=${encodeURIComponent(kp)}`
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
                >
                  <Play className="w-3 h-3" />
                  开始
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
