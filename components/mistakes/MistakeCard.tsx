"use client"

import { Lightbulb, RotateCw, CheckCircle } from "lucide-react"

interface MistakeCardProps {
  mistake: {
    id: string
    mistake_type: string
    ai_analysis?: string | null
    avoidance_tip?: string | null
    is_remediated: boolean
    created_at: string
    knowledge_point_name?: string
    question_text?: string
    correct_answer?: string
    student_answer?: string
  }
}

export function MistakeCard({ mistake }: MistakeCardProps) {
  const typeMap: Record<string, { label: string; emoji: string; color: string }> = {
    knowledge: { label: "知识型", emoji: "🔴", color: "bg-red-50 text-red-700 border-red-200" },
    habit: { label: "习惯型", emoji: "🟡", color: "bg-amber-50 text-amber-700 border-amber-200" },
    thinking: { label: "思维型", emoji: "🔵", color: "bg-blue-50 text-blue-700 border-blue-200" },
  }

  const typeInfo = typeMap[mistake.mistake_type] || typeMap.knowledge

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
      {/* 顶部标签 */}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full text-xs border ${typeInfo.color}`}>
          {typeInfo.emoji} {typeInfo.label}
        </span>
        {mistake.is_remediated ? (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            已掌握
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <RotateCw className="w-3 h-3" />
            待复习
          </span>
        )}
      </div>

      {/* 题目 */}
      {mistake.question_text && (
        <p className="text-sm text-gray-900 line-clamp-3">{mistake.question_text}</p>
      )}

      {/* 答案对比 */}
      {mistake.student_answer && mistake.correct_answer && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-red-50 rounded">
            <p className="text-red-400 mb-0.5">❌ 你的答案</p>
            <p className="text-red-700 truncate">{mistake.student_answer}</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-green-400 mb-0.5">✅ 正确答案</p>
            <p className="text-green-700 truncate">{mistake.correct_answer}</p>
          </div>
        </div>
      )}

      {/* 分析 */}
      {mistake.ai_analysis && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">📝 错因分析</p>
          <p className="text-sm text-gray-700">{mistake.ai_analysis}</p>
        </div>
      )}

      {/* 避坑口诀 */}
      {mistake.avoidance_tip && (
        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium">{mistake.avoidance_tip}</p>
        </div>
      )}

      {/* 知识点 + 时间 */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        {mistake.knowledge_point_name && <span>{mistake.knowledge_point_name}</span>}
        <span>{new Date(mistake.created_at).toLocaleDateString("zh-CN")}</span>
      </div>
    </div>
  )
}
