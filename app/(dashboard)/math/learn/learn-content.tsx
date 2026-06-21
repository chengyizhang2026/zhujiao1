"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import { MATH_CHAPTERS } from "@/lib/constants"
import { ArrowLeft, Play, Loader2, Brain, Lightbulb, AlertTriangle } from "lucide-react"
import { MermaidRenderer } from "@/components/shared/MermaidRenderer"
import { SvgRenderer } from "@/components/shared/SvgRenderer"

export function LearnContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chapterId = searchParams.get("chapter") || ""
  const knowledgePoint = searchParams.get("kp") || ""

  const chapter = MATH_CHAPTERS.find((c) => c.id === chapterId)
  const {
    startSession,
    learningContent,
    setLearningContent,
    setPhase,
    isActive,
  } = useSessionStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showMindMap, setShowMindMap] = useState(false)

  useEffect(() => {
    if (!chapter || !knowledgePoint || isActive) return

    async function loadContent() {
      setLoading(true)
      setError("")
      const ch = chapter!

      try {
        startSession({ subject: "math", chapterId, knowledgePoint })

        const kpIndex = ch.knowledgePoints.indexOf(knowledgePoint)
        const previousKnowledge = kpIndex > 0 ? ch.knowledgePoints.slice(0, kpIndex) : []

        const response = await fetch("/api/ai/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapterTitle: ch.title,
            knowledgePoint,
            previousKnowledge,
            subject: "math",
          }),
        })

        const json = await response.json()
        if (json.success) {
          setLearningContent(json.data)
          setPhase("learn")
        } else {
          setError("AI生成内容失败，请重试")
        }
      } catch {
        setError("网络错误，请检查连接后重试")
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [chapter, knowledgePoint])

  if (!chapter || !knowledgePoint) {
    return (
      <div className="p-4 pt-12 text-center">
        <p className="text-gray-500">参数错误</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{knowledgePoint}</h1>
          <p className="text-xs text-gray-400">{chapter.title}</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm text-gray-500">AI正在为你准备学习内容...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-16 space-y-4">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg">重试</button>
        </div>
      )}

      {learningContent && !loading && (
        <>
          {learningContent.mindMapMermaid && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button onClick={() => setShowMindMap(!showMindMap)} className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2"><Brain className="w-4 h-4 text-purple-500" />{showMindMap ? "收起思维导图" : "查看思维导图"}</span>
                <span className="text-xs text-gray-400">{showMindMap ? "▲" : "▼"}</span>
              </button>
              {showMindMap && <div className="px-3 pb-4"><MermaidRenderer chart={learningContent.mindMapMermaid} /></div>}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">📖 知识点讲解</h2>
            <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: fmt(learningContent.explanation) }} />
          </div>

          {learningContent.keyPoints?.length > 0 && (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
              <h2 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> 重点</h2>
              <ul className="space-y-1">
                {learningContent.keyPoints.map((kp: string, i: number) => (
                  <li key={i} className="text-sm text-amber-800 flex gap-2"><span className="text-amber-400 font-bold">{i + 1}.</span><span dangerouslySetInnerHTML={{ __html: fmt(kp) }} /></li>
                ))}
              </ul>
            </div>
          )}

          {learningContent.commonMistakes?.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <h2 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> ⚠️ 常见误区</h2>
              <div className="space-y-2">
                {learningContent.commonMistakes.map((cm: { mistake: string; correction: string }, i: number) => (
                  <div key={i} className="text-sm"><p className="text-red-700 line-through">❌ {cm.mistake}</p><p className="text-green-700">✅ {cm.correction}</p></div>
                ))}
              </div>
            </div>
          )}

          {learningContent.memoryTip && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4">
              <h2 className="text-sm font-semibold text-indigo-700 mb-2">💡 记忆口诀</h2>
              <p className="text-indigo-900 font-medium">{learningContent.memoryTip}</p>
            </div>
          )}

          {learningContent.examples?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">📝 例题</h2>
              <div className="space-y-4">
                {learningContent.examples.map((ex: { question: string; solution: string; svgDiagram?: string }, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 mb-2">例{i + 1}：{ex.question}</p>
                    {ex.svgDiagram && ex.svgDiagram !== "null" && <SvgRenderer svg={ex.svgDiagram} className="mb-2" />}
                    <div className="text-xs text-gray-600 border-t border-gray-200 pt-2 mt-2">
                      <span className="font-medium text-green-600">解：</span>
                      <span dangerouslySetInnerHTML={{ __html: fmt(ex.solution) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {learningContent.realLifeConnection && (
            <div className="bg-green-50 rounded-xl border border-green-100 p-4">
              <h2 className="text-sm font-semibold text-green-700 mb-2">🌍 生活中的应用</h2>
              <p className="text-sm text-green-800">{learningContent.realLifeConnection}</p>
            </div>
          )}

          <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
            <div className="max-w-lg mx-auto">
              <button onClick={() => router.push(`/math/practice?chapter=${chapterId}&kp=${encodeURIComponent(knowledgePoint)}`)} className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />开始练习
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function fmt(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")
    .replace(/\$\$(.*?)\$\$/g, "<span class='math-block'>$1</span>")
    .replace(/\$(.*?)\$/g, "<span class='math-inline'>$1</span>")
}
