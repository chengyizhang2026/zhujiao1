"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, RotateCw, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { QualitySelector } from "@/components/spaced-repetition/QualitySelector"
import { ENGLISH_MODULES } from "@/lib/constants"

export default function VocabPage() {
  const router = useRouter()
  const [words, setWords] = useState<unknown[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rated, setRated] = useState(false)
  const [direction, setDirection] = useState<"en_to_cn" | "cn_to_en">("en_to_cn")
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("vocabulary")
        .select("*")
        .limit(20)

      if (data?.length) {
        setWords(data)
      } else {
        // 从常量数据生成演示单词
        const demo = ENGLISH_MODULES.flatMap((mod) =>
          mod.grammar.map((g, i) => ({
            id: `${mod.id}-${i}`,
            word: g.split("(")[0]?.trim() || g,
            chinese_meaning: g,
            part_of_speech: "grammar",
          }))
        )
        setWords(demo)
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  const current = words[currentIdx] as Record<string, string> | undefined
  const isLast = currentIdx >= words.length - 1

  function handleRate(quality: number) {
    setRated(true)
    setTimeout(() => {
      if (!isLast) {
        setCurrentIdx((i) => i + 1)
        setFlipped(false)
        setRated(false)
      }
    }, 400)
  }

  function handleFlip() {
    if (!flipped) setFlipped(true)
  }

  if (loading) {
    return (
      <div className="p-4 pt-12 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
        <p className="text-sm text-gray-500 mt-2">加载单词中...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">单词闪卡</h1>
          <p className="text-xs text-gray-400">
            {currentIdx + 1}/{words.length} · {direction === "en_to_cn" ? "英→中" : "中→英"}
          </p>
        </div>
        <button
          onClick={() => setDirection((d) => (d === "en_to_cn" ? "cn_to_en" : "en_to_cn"))}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-lg"
        >
          <RotateCw className="w-3 h-3" />
          切换
        </button>
      </div>

      {/* 闪卡 */}
      {current && (
        <div className="space-y-4">
          <div
            onClick={handleFlip}
            className={`relative w-full aspect-[4/3] rounded-2xl cursor-pointer transition-all duration-500 ${
              flipped ? "bg-green-50 border-green-200" : "bg-indigo-50 border-indigo-200"
            } border-2 flex items-center justify-center p-6`}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {direction === "en_to_cn" ? current.word : current.chinese_meaning}
              </p>
              {flipped && (
                <div className="space-y-1 animate-fadeIn">
                  <p className="text-xl text-green-700 font-semibold">
                    {direction === "en_to_cn" ? current.chinese_meaning : current.word}
                  </p>
                  {current.part_of_speech && (
                    <p className="text-xs text-green-500">{current.part_of_speech}</p>
                  )}
                </div>
              )}
              {!flipped && (
                <p className="text-xs text-indigo-400 mt-4">点击翻转查看答案</p>
              )}
            </div>
          </div>

          {flipped && !rated && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 text-center">这次回忆感觉如何？</p>
              <QualitySelector value={null} onChange={handleRate} />
            </div>
          )}

          {rated && isLast && (
            <div className="text-center py-8">
              <p className="text-lg font-semibold text-green-600">🎉 本轮完成！</p>
              <p className="text-sm text-gray-500 mt-1">已复习 {words.length} 个单词</p>
              <button
                onClick={() => { setCurrentIdx(0); setFlipped(false); setRated(false) }}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                再来一轮
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
