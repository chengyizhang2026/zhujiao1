"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, Lightbulb, AlertTriangle, ChevronRight, BookOpen, Play, CheckCircle2 } from "lucide-react"
import { ENGLISH_MODULES } from "@/lib/constants"

export default function GrammarPageWrapper() {
  return (
    <Suspense fallback={<div className="p-4 pt-12 text-center text-gray-500">加载中...</div>}>
      <GrammarContent />
    </Suspense>
  )
}

function GrammarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduleId = searchParams.get("module") || ""
  const mod = ENGLISH_MODULES.find((m) => m.id === moduleId)

  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [selectedGrammar, setSelectedGrammar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState("")

  async function loadTopic(topic: string) {
    setLoading(true); setError(""); setContent(null)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterTitle: mod?.title || topic, knowledgePoint: topic, previousKnowledge: [], subject: "english" }),
      })
      const json = await response.json()
      if (json.success) setContent(json.data as Record<string, unknown>)
      else setError("AI生成内容失败，请重试")
    } catch { setError("网络错误") }
    finally { setLoading(false) }
  }

  function handleLessonClick(lesson: string) {
    setSelectedLesson(lesson)
    setSelectedGrammar(null)
    loadTopic(lesson)
  }

  function handleGrammarClick(grammar: string) {
    setSelectedGrammar(grammar)
    setSelectedLesson(null)
    loadTopic(grammar)
  }

  // Landing: show unit overview
  if (!mod) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <div className="pt-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
          <div><h1 className="text-lg font-bold text-gray-900">📝 语法学习</h1><p className="text-xs text-gray-400">外研版 · 七年级上册（2024新版）</p></div>
        </div>
        <div className="space-y-2">
          {ENGLISH_MODULES.map((mod) => (
            <button key={mod.id} onClick={() => router.push(`/english/grammar?module=${mod.id}&topic=${encodeURIComponent(mod.topic)}&grammar=${encodeURIComponent(mod.grammar[0])}`)}
              className="w-full p-4 bg-white rounded-xl border border-gray-100 text-left hover:border-green-200 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">{mod.moduleNo === 0 ? "S" : mod.moduleNo}</span>
                  <h3 className="text-sm font-semibold text-gray-900">{mod.title}</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex flex-wrap gap-1">{mod.grammar.map((g) => <span key={g} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">{g}</span>)}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.push("/english")} className="p-1 -ml-1"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{mod.title}</h1>
          <p className="text-xs text-gray-400">{mod.topic}</p>
        </div>
      </div>

      {/* Content area */}
      {(selectedLesson || selectedGrammar) ? (
        /* ---- Learning Content ---- */
        <div className="space-y-4">
          <button onClick={() => { setSelectedLesson(null); setSelectedGrammar(null); setContent(null) }} className="text-sm text-indigo-600 hover:underline">
            ← 返回课程列表
          </button>
          <h2 className="text-base font-semibold text-gray-900">{selectedLesson || selectedGrammar}</h2>
          {loading && <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" /><p className="text-sm text-gray-500 mt-2">AI正在准备...</p></div>}
          {error && <div className="text-center py-16"><AlertTriangle className="w-8 h-8 text-red-400 mx-auto" /><p className="text-sm text-red-500">{error}</p><button onClick={() => loadTopic(selectedLesson || selectedGrammar || "")} className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg">重试</button></div>}
          {content && (
            <>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">📖 讲解</h3>
                <div className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: fmt(content.explanation as string || "") }} />
              </div>
              {(content.keyPoints as string[])?.length > 0 && (
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                  <h3 className="text-sm font-semibold text-amber-700 mb-2"><Lightbulb className="w-4 h-4 inline mr-1" />重点</h3>
                  <ul className="space-y-1">{(content.keyPoints as string[]).map((kp, i) => <li key={i} className="text-sm text-amber-800">{i + 1}. {kp}</li>)}</ul>
                </div>
              )}
              {(content.examples as Array<{ question: string; solution: string }>)?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">📝 例句</h3>
                  {(content.examples as Array<{ question: string; solution: string }>).map((ex, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded mb-2"><p className="text-sm font-medium">{ex.question}</p><p className="text-xs text-green-600">{ex.solution}</p></div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* ---- Unit Overview: Lessons + Grammar ---- */
        <div className="space-y-4">
          {/* Reading passage */}
          {mod.reading && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">📖 课文</h2>
              <p className="text-sm font-medium text-gray-900">{mod.reading}</p>
            </div>
          )}

          {/* Grammar tabs */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">🔤 语法要点</h2>
            <div className="space-y-2">
              {mod.grammar.map((g) => (
                <button key={g} onClick={() => handleGrammarClick(g)}
                  className="w-full p-3 bg-white rounded-xl border border-green-100 text-left hover:border-green-300 hover:shadow-sm transition-all flex items-center justify-between">
                  <span className="text-sm text-gray-800">{g}</span>
                  <Play className="w-4 h-4 text-green-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Lessons */}
          {mod.lessons && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">📚 课时 ({mod.lessons.length})</h2>
              <div className="space-y-2">
                {mod.lessons.map((lesson, i) => (
                  <button key={i} onClick={() => handleLessonClick(lesson)}
                    className="w-full p-3 bg-white rounded-xl border border-gray-100 text-left hover:border-green-200 hover:shadow-sm transition-all flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-5 flex-shrink-0">{i + 1}</span>
                    <span className="text-sm text-gray-700 flex-1">{lesson}</span>
                    <Play className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function fmt(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>")
}
