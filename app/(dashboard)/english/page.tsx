"use client"

import { ENGLISH_MODULES } from "@/lib/constants"
import { Languages, ChevronRight, Sparkles, BookOpen, Pencil, Headphones, FileText } from "lucide-react"
import Link from "next/link"

const ENGLISH_SUB_MODULES = [
  { key: "vocab", label: "单词闪卡", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100" },
  { key: "grammar", label: "语法练习", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
  { key: "reading", label: "阅读理解", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
  { key: "listening", label: "听力训练", icon: Headphones, color: "text-orange-600", bg: "bg-orange-100" },
  { key: "writing", label: "写作练习", icon: Pencil, color: "text-pink-600", bg: "bg-pink-100" },
]

export default function EnglishPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">🌍 英语</h1>
        <p className="text-sm text-gray-500 mt-1">外研版 · 七年级上册</p>
      </div>

      {/* 快捷入口 */}
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

      {/* 教材模块 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
          教材模块
        </h2>
        <div className="space-y-2">
          {ENGLISH_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="p-3 bg-white rounded-xl border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-green-600">M{mod.moduleNo}</span>
                <h3 className="text-sm font-semibold text-gray-900">{mod.title}</h3>
              </div>
              <p className="text-xs text-gray-400">{mod.topic}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {mod.grammar.map((g) => (
                  <span key={g} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
