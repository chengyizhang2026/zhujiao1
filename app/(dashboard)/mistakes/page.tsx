"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { MistakeCard } from "@/components/mistakes/MistakeCard"
import { FileX, Filter } from "lucide-react"
import { MISTAKE_TYPES } from "@/lib/constants"

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from("mistakes")
        .select(`
          *,
          questions:question_id (question_text, correct_answer),
          exercises:exercise_id (student_answer)
        `)
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (filter !== "all") {
        query = query.eq("mistake_type", filter)
      }

      const { data, error } = await query
      if (!error && data) {
        setMistakes(data)
      }
      setLoading(false)
    }
    load()
  }, [filter, supabase])

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">❌ 错题本</h1>
        <p className="text-sm text-gray-500 mt-1">记录和分析每一道错题</p>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            filter === "all" ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200"
          }`}
        >
          全部
        </button>
        {Object.entries(MISTAKE_TYPES).map(([key, type]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              filter === key ? "bg-indigo-600 text-white" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {type.emoji} {type.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-3 bg-gray-50 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : mistakes.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <FileX className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-base font-semibold text-gray-700">还没有错题</h2>
          <p className="text-sm text-gray-400 mt-1">开始学习后，做错的题目会自动出现在这里</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mistakes.map((m: any) => (
            <MistakeCard
              key={m.id}
              mistake={{
                id: m.id,
                mistake_type: m.mistake_type,
                ai_analysis: m.ai_analysis,
                avoidance_tip: m.avoidance_tip,
                is_remediated: m.is_remediated,
                created_at: m.created_at,
                question_text: m.questions?.question_text,
                correct_answer: m.questions?.correct_answer,
                student_answer: m.exercises?.student_answer,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
