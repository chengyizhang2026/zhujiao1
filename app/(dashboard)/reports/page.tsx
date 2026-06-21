"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { BarChart3, Loader2, Trophy, TrendingUp, AlertTriangle } from "lucide-react"

export default function ReportsPage() {
  const [report, setReport] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // 获取本周起止日期
      const now = new Date()
      const dayOfWeek = now.getDay()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
      const weekEnd = new Date(now)
      weekEnd.setDate(weekStart.getDate() + 6)

      const ws = weekStart.toISOString().slice(0, 10)
      const we = weekEnd.toISOString().slice(0, 10)

      // 尝试从数据库加载已有报告
      const { data } = await supabase
        .from("weekly_reports")
        .select("*")
        .eq("profile_id", user.id)
        .eq("week_start", ws)
        .maybeSingle()

      if (data) {
        setReport(data.report_data as Record<string, unknown>)
      } else {
        // 生成新报告
        try {
          const resp = await fetch("/api/ai/generate-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ weekStart: ws, weekEnd: we }),
          })
          const json = await resp.json()
          if (json.success) setReport(json.data as Record<string, unknown>)
        } catch { /* ignore */ }
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  const radarData = (report?.radarData || { math: {}, english: {} }) as Record<string, Record<string, number>>
  const weakPoints = (report?.weakPoints || []) as Array<{ name: string; score: number; suggestion: string }>
  const strengths = (report?.strengths || []) as string[]

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">📊 学习报告</h1>
        <p className="text-sm text-gray-500 mt-1">本周学习进度与薄弱点分析</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm text-gray-500 mt-2">生成周报中...</p>
        </div>
      ) : !report ? (
        <div className="text-center py-16">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-400">完成学习后，周报将在这里自动生成</p>
        </div>
      ) : (
        <>
          {/* 总结 */}
          {report.summary && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4">
              <p className="text-sm text-indigo-800">{report.summary as string}</p>
            </div>
          )}

          {/* 雷达图占位 */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> 本周掌握度
            </h2>
            <div className="space-y-4">
              {Object.entries(radarData).map(([subject, values]) => (
                <div key={subject}>
                  <h3 className="text-xs font-semibold text-gray-600 mb-2">
                    {subject === "math" ? "📐 数学" : "🌍 英语"}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(values).map(([label, score]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">{label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(100, score)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8 text-right">
                          {Math.round(score)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 薄弱点 */}
          {weakPoints.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> ⚠️ 需要加强
              </h2>
              <div className="space-y-2">
                {weakPoints.map((wp, i) => (
                  <div key={i} className="p-2 bg-white/60 rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-800">{wp.name}</span>
                      <span className="text-xs text-red-500">{Math.round(wp.score)}分</span>
                    </div>
                    <p className="text-xs text-red-600 mt-0.5">{wp.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 做得好的 */}
          {strengths.length > 0 && (
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <h2 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> 做得好的
              </h2>
              <ul className="space-y-1">
                {strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-800 flex gap-2">
                    <span>✅</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 鼓励 */}
          {report.encouragement && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-lg font-semibold text-indigo-600">
                {report.encouragement as string}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
