"use client"

import { MATH_CHAPTERS } from "@/lib/constants"
import { BookOpen, ChevronRight, Circle } from "lucide-react"
import Link from "next/link"

export default function MathPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">📐 数学</h1>
        <p className="text-sm text-gray-500 mt-1">北师大版 · 七年级上册</p>
      </div>

      <div className="space-y-2">
        {MATH_CHAPTERS.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/math/${chapter.id}`}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-blue-600">{chapter.chapterNo}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{chapter.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {chapter.knowledgePoints.length} 个知识点
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  )
}
