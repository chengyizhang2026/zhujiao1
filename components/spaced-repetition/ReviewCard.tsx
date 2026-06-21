"use client"

import { useState } from "react"
import { QualitySelector } from "./QualitySelector"
import { Lightbulb, CheckCircle } from "lucide-react"

interface ReviewCardProps {
  item: {
    id: string
    item_type: string
    questionText?: string
    correctAnswer?: string
    avoidanceTip?: string
    consecutiveCorrect: number
    mistakeType?: string
  }
  onRate: (quality: number) => void
}

export function ReviewCard({ item, onRate }: ReviewCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [rated, setRated] = useState(false)

  const handleRate = (quality: number) => {
    setRated(true)
    setTimeout(() => onRate(quality), 300)
  }

  const mistakeTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      knowledge: "🔴 知识型",
      habit: "🟡 习惯型",
      thinking: "🔵 思维型",
    }
    return map[type] || type
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
      {/* 题目 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-400">复习 #{item.consecutiveCorrect + 1}</span>
          {item.mistakeType && (
            <span className="text-xs px-1.5 py-0.5 bg-gray-50 rounded">
              {mistakeTypeLabel(item.mistakeType)}
            </span>
          )}
        </div>
        <p className="text-base text-gray-900 leading-relaxed">{item.questionText || "题目加载中..."}</p>
      </div>

      {/* 答案区域 */}
      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
        >
          点击查看答案
        </button>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 mb-1">正确答案</p>
              <p className="text-sm text-gray-900 font-medium">{item.correctAnswer || "暂无"}</p>
            </div>
          </div>
          {item.avoidanceTip && (
            <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{item.avoidanceTip}</p>
            </div>
          )}
        </div>
      )}

      {/* 评分 */}
      {showAnswer && !rated && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 text-center">这次回忆感觉如何？</p>
          <QualitySelector value={null} onChange={handleRate} />
        </div>
      )}

      {/* 评分完成 */}
      {rated && (
        <div className="text-center py-2">
          <p className="text-sm text-green-600">已记录 ✓</p>
        </div>
      )}
    </div>
  )
}
