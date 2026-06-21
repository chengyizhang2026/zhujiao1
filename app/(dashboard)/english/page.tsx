"use client"

import { useState } from "react"
import { ENGLISH_MODULES } from "@/lib/constants"
import { ChevronRight, Sparkles, BookOpen, Pencil, Headphones, FileText, ChevronDown, Play } from "lucide-react"
import Link from "next/link"

const ENGLISH_SUB_MODULES = [
  { key: "vocab", label: "单词闪卡", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100" },
  { key: "grammar", label: "语法练习", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
  { key: "reading", label: "阅读理解", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
  { key: "listening", label: "听力训练", icon: Headphones, color: "text-orange-600", bg: "bg-orange-100" },
  { key: "writing", label: "写作练习", icon: Pencil, color: "text-pink-600", bg: "bg-pink-100" },
]

export default function EnglishPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">🌍 英语</h1>
        <p className="text-sm text-gray-500 mt-1">外研版 · 七年级上册（2024新版）</p>
      </div>

      {/* 教材单元 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          教材单元
        </h2>
        <div className="space-y-2">
          {ENGLISH_MODULES.map((mod) => {
            const isOpen = expanded === mod.id
            return (
              <div key={mod.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* 单元标题栏 — 点击展开 */}
                <button
                  onClick={() => setExpanded(isOpen ? null : mod.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                        {mod.moduleNo === 0 ? "S" : mod.moduleNo}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900">{mod.title}</h3>
                    </div>
                    <span className="text-gray-300">{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{mod.topic}</p>
                  <div className="flex flex-wrap gap-1">
                    {mod.grammar.map((g) => (
                      <span key={g} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">{g}</span>
                    ))}
                  </div>
                  {mod.lessons && (
                    <p className="text-xs text-gray-400 mt-2">{mod.lessons.length} 个课时</p>
                  )}
                </button>

                {/* 展开后显示课时列表 */}
                {isOpen && mod.lessons && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">课时安排</p>
                    {mod.lessons.map((lesson, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-gray-400 w-5">{i + 1}.</span>
                        <span className="text-gray-700">{lesson}</span>
                      </div>
                    ))}
                    <Link
                      href={`/english/grammar?module=${mod.id}&topic=${encodeURIComponent(mod.topic)}&grammar=${encodeURIComponent(mod.grammar[0])}`}
                      className="mt-3 flex items-center justify-center gap-1 w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      学习本单元语法
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 专项练习 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          专项练习
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {ENGLISH_SUB_MODULES.map((mod) => {
            const Icon = mod.icon
            return (
              <Link
                key={mod.key}
                href={`/english/${mod.key}`}
                className="p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all text-center"
              >
                <div className={`w-8 h-8 ${mod.bg} rounded-lg flex items-center justify-center mx-auto mb-1`}>
                  <Icon className={`w-4 h-4 ${mod.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-700">{mod.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
