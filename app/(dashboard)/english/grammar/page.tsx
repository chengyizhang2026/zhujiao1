"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle, CircleX, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { ENGLISH_MODULES } from "@/lib/constants"

export default function GrammarPage() {
  const router = useRouter()
  const [selectedModule, setSelectedModule] = useState("")
  const [step, setStep] = useState<"select" | "practice" | "done">("select")

  const module = ENGLISH_MODULES.find((m) => m.id === selectedModule)

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">📝 语法练习</h1>
          <p className="text-xs text-gray-400">外研版七年级上册</p>
        </div>
      </div>

      {step === "select" && (
        <div className="space-y-2">
          {ENGLISH_MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => { setSelectedModule(mod.id); setStep("practice") }}
              className="w-full p-3 bg-white rounded-xl border border-gray-100 text-left hover:border-green-200"
            >
              <p className="text-sm font-semibold text-gray-900">M{mod.moduleNo} {mod.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {mod.grammar.map((g) => (
                  <span key={g} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full">{g}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === "practice" && module && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              M{module.moduleNo} {module.title} — 语法讲解
            </h3>
            <p className="text-sm text-gray-600">{module.topic}</p>
            <div className="mt-3 space-y-2">
              {module.grammar.map((g) => (
                <div key={g} className="flex items-start gap-2 p-2 bg-green-50 rounded">
                  <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">{g}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">语法练习题将在连接AI后动态生成</p>
            <p className="text-gray-400 text-xs mt-1">（类似数学练习的"先提示后答案"模式）</p>
          </div>

          <button
            onClick={() => setStep("select")}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm"
          >
            返回选择模块
          </button>
        </div>
      )}
    </div>
  )
}
