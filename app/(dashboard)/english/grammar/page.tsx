"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Play, Loader2, Lightbulb, AlertTriangle, ChevronRight } from "lucide-react"
import Link from "next/link"
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
  const topic = searchParams.get("topic") || ""
  const grammar = searchParams.get("grammar") || ""
  const mod = ENGLISH_MODULES.find((m) => m.id === moduleId)

  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!grammar) return
    loadContent(grammar)
  }, [grammar])

  async function loadContent(grammarTopic: string) {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterTitle: mod?.title || grammarTopic,
          knowledgePoint: grammarTopic,
          previousKnowledge: [],
          subject: "english",
        }),
      })
      const json = await response.json()
      if (json.success) setContent(json.data as Record<string, unknown>)
      else setError("AI生成内容失败，请重试")
    } catch { setError("网络错误，请检查连接后重试") }
    finally { setLoading(false) }
  }

  function handleModuleClick(m: typeof ENGLISH_MODULES[0]) {
    router.push(`/english/grammar?module=${m.id}&topic=${encodeURIComponent(m.topic)}&grammar=${encodeURIComponent(m.grammar[0])}`)
  }

  if (grammar) {
    return (
      <div className="p-4 space-y-4 pb-24">
        <div className="pt-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 -ml-1"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
          <div><h1 className="text-lg font-bold text-gray-900">{grammar}</h1><p className="text-xs text-gray-400">{mod?.title} · {topic}</p></div>
        </div>
        {loading && <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" /><p className="text-sm text-gray-500 mt-2">AI正在准备语法讲解...</p></div>}
        {error && <div className="text-center py-16"><AlertTriangle className="w-8 h-8 text-red-400 mx-auto" /><p className="text-sm text-red-500">{error}</p><button onClick={() => loadContent(grammar)} className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg">重试</button></div>}
        {content && !loading && (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">📖 语法讲解</h2>
              <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: fmt(content.explanation as string || "") }} />
            </div>
            {(content.keyPoints as string[])?.length > 0 && (
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
                <h2 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> 重点</h2>
                <ul className="space-y-1">{(content.keyPoints as string[]).map((kp, i) => <li key={i} className="text-sm text-amber-800 flex gap-2"><span className="text-amber-400 font-bold">{i + 1}.</span><span dangerouslySetInnerHTML={{ __html: fmt(kp) }} /></li>)}</ul>
              </div>
            )}
            {(content.commonMistakes as Array<{mistake: string; correction: string}>)?.length > 0 && (
              <div className="bg-red-50 rounded-xl border border-red-100 p-4">
                <h2 className="text-sm font-semibold text-red-700 mb-2"><AlertTriangle className="w-4 h-4 inline mr-1" />⚠️ 常见误区</h2>
                {(content.commonMistakes as Array<{mistake: string; correction: string}>).map((cm, i) => <div key={i} className="text-sm mt-1"><p className="text-red-700 line-through">❌ {cm.mistake}</p><p className="text-green-700">✅ {cm.correction}</p></div>)}
              </div>
            )}
            {(content.memoryTip as string) && <div className="bg-green-50 rounded-xl border border-green-100 p-4"><h2 className="text-sm font-semibold text-green-700 mb-2">💡 记忆口诀</h2><p className="text-green-900 font-medium">{content.memoryTip as string}</p></div>}
            {(content.examples as Array<{question: string; solution: string}>)?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">📝 例句</h2>
                {(content.examples as Array<{question: string; solution: string}>).map((ex, i) => <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2"><p className="text-sm font-medium text-gray-800">{i + 1}. {ex.question}</p><p className="text-xs text-green-600 mt-1">{ex.solution}</p></div>)}
              </div>
            )}
          </>
        )}
        <button onClick={() => router.push("/english")} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm">返回英语首页</button>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
        <div><h1 className="text-lg font-bold text-gray-900">📝 语法学习</h1><p className="text-xs text-gray-400">外研版 · 七年级上册（2024新版）</p></div>
      </div>
      <div className="space-y-2">
        {ENGLISH_MODULES.map((mod) => (
          <button key={mod.id} onClick={() => handleModuleClick(mod)}
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

function fmt(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>")
}
