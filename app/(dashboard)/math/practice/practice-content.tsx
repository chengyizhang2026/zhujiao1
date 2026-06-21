"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import { MATH_CHAPTERS } from "@/lib/constants"
import { ArrowLeft, Lightbulb, Loader2, CheckCircle, CircleX, ChevronRight, RotateCcw, Target } from "lucide-react"

export function PracticeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chapterId = searchParams.get("chapter") || ""
  const knowledgePoint = searchParams.get("kp") || ""

  const chapter = MATH_CHAPTERS.find((c) => c.id === chapterId)
  const {
    questions,
    currentQuestionIndex,
    totalCorrect,
    totalWrong,
    setQuestions,
    answerQuestion,
    setGradingResult,
    retryQuestion,
    nextQuestion,
    setPhase,
    addMistakeAnalysis,
  } = useSessionStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [answer, setAnswer] = useState("")
  const [grading, setGrading] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex >= questions.length - 1
  const allAnswered = questions.every((q) => q.isCorrect !== null)

  // 加载题目
  useEffect(() => {
    if (!chapter || !knowledgePoint) return

    async function loadQuestions() {
      setLoading(true)
      setError("")

      try {
        const response = await fetch("/api/ai/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            knowledgePoint,
            chapterContext: chapter?.title || "",
            difficultyCounts: { basic: 2, consolidation: 2, advanced: 1 },
          }),
        })

        const json = await response.json()
        if (json.success && Array.isArray(json.data?.questions)) {
          setQuestions(json.data.questions)
        } else if (json.success && Array.isArray(json.data)) {
          setQuestions(json.data)
        } else {
          setError("生成题目失败，请重试")
        }
      } catch (err) {
        setError("网络错误，请检查连接后重试")
      } finally {
        setLoading(false)
      }
    }

    if (questions.length === 0) {
      loadQuestions()
    } else {
      setLoading(false)
    }
  }, [chapter, knowledgePoint])

  // 提交答案
  const handleSubmit = useCallback(async () => {
    if (!answer.trim() || grading || !currentQuestion?.question) return

    setGrading(true)
    const idx = currentQuestionIndex
    answerQuestion(answer)

    try {
      const response = await fetch("/api/ai/grade-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: currentQuestion.question.question_text || currentQuestion.question.questionText,
          correctAnswer: currentQuestion.question.correct_answer || currentQuestion.question.correctAnswer,
          studentAnswer: answer,
          attemptNumber: currentQuestion.attemptNumber + 1,
          hintsUsed: currentQuestion.hintsUsed + (showHint ? hintLevel : 0),
        }),
      })

      const json = await response.json()
      if (json.success) {
        setGradingResult(idx, {
          isCorrect: json.data.isCorrect,
          feedback: json.data.feedback,
        })

        // 如果第一次做错，分析错因
        if (!json.data.isCorrect && currentQuestion.attemptNumber + 1 >= 2) {
          analyzeMistake(answer)
        }

        // 如果第一次做错但还能重试
        if (!json.data.isCorrect && currentQuestion.attemptNumber + 1 < 2) {
          // 不给答案，让学生重试
        }
      }
    } catch (err) {
      console.error("Grading error:", err)
    } finally {
      setGrading(false)
    }
  }, [answer, grading, currentQuestion, currentQuestionIndex])

  // 分析错因
  async function analyzeMistake(studentAnswer: string) {
    if (!currentQuestion?.question) return

    try {
      const response = await fetch("/api/ai/analyze-mistake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: currentQuestion.question.question_text || currentQuestion.question.questionText,
          correctAnswer: currentQuestion.question.correct_answer || currentQuestion.question.correctAnswer,
          studentAnswer,
          knowledgePoint,
        }),
      })

      const json = await response.json()
      if (json.success) {
        addMistakeAnalysis({
          questionIndex: currentQuestionIndex,
          mistakeType: json.data.mistakeType,
          analysis: json.data.analysis,
          avoidanceTip: json.data.avoidanceTip,
        })
      }
    } catch (err) {
      console.error("Mistake analysis error:", err)
    }
  }

  // 处理重试
  function handleRetry() {
    setAnswer("")
    setShowHint(false)
    setHintLevel(0)
    retryQuestion(currentQuestionIndex)
  }

  // 下一题
  function handleNext() {
    setAnswer("")
    setShowHint(false)
    setHintLevel(0)
    nextQuestion()
  }

  // 显示提示
  function handleShowHint() {
    if (!currentQuestion?.question?.hints) return
    const hints = currentQuestion.question.hints as string[]
    if (Array.isArray(hints) && hintLevel < hints.length) {
      setShowHint(true)
      setHintLevel((l) => Math.min(l + 1, hints.length))
    }
  }

  // 完成练习
  function handleComplete() {
    setPhase("assess")
    router.push(
      `/math/learn?chapter=${chapterId}&kp=${encodeURIComponent(knowledgePoint)}&complete=true`
    )
  }

  // 难度标签（用于AI返回的question数据）
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function get(q: any, camelKey: string, snakeKey: string): any {
    return q[camelKey] ?? q[snakeKey]
  }

  const difficultyLabel = (d: string) => {
    const map: Record<string, { label: string; color: string }> = {
      basic: { label: "基础", color: "bg-green-100 text-green-700" },
      consolidation: { label: "巩固", color: "bg-amber-100 text-amber-700" },
      advanced: { label: "拔高", color: "bg-red-100 text-red-700" },
    }
    return map[d] || { label: d, color: "bg-gray-100 text-gray-700" }
  }

  if (!chapter || !knowledgePoint) {
    return (
      <div className="p-4 pt-12 text-center">
        <p className="text-gray-500">参数错误</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* 顶部 */}
      <div className="pt-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">练习</h1>
            <span className="text-sm text-gray-400">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
          <p className="text-xs text-gray-400">{knowledgePoint}</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            {totalCorrect}
          </span>
          <span className="flex items-center gap-1">
            <CircleX className="w-3.5 h-3.5 text-red-400" />
            {totalWrong}
          </span>
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{
            width: `${questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%`,
          }}
        />
      </div>

      {/* 加载 */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-sm text-gray-500 mt-2">AI正在出题...</p>
        </div>
      )}

      {/* 错误 */}
      {error && (
        <div className="text-center py-16">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg"
          >
            重试
          </button>
        </div>
      )}

      {/* 题目 */}
      {currentQuestion?.question && !loading && (
        <div className="space-y-4">
          {/* 难度标签 */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                difficultyLabel(
                  (currentQuestion.question as any).difficulty as string
                ).color
              }`}
            >
              {difficultyLabel((currentQuestion.question as any).difficulty as string).label}
            </span>
          </div>

          {/* 题面 */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-base text-gray-900 leading-relaxed">
              {(currentQuestion.question as any).question_text as string ||
                (currentQuestion.question as any).questionText as string}
            </p>

            {/* 选择题选项 */}
            {((currentQuestion.question as any).question_type === "multiple_choice" ||
              (currentQuestion.question as any).questionType === "multiple_choice") &&
              (currentQuestion.question as any).options && (
                <div className="mt-4 space-y-2">
                  {((currentQuestion.question as any).options as string[])?.map(
                    (opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setAnswer(opt)}
                        className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                          answer === opt
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  )}
                </div>
              )}
          </div>

          {/* 答案输入（非选择题） */}
          {((currentQuestion.question as any).question_type !== "multiple_choice" &&
            (currentQuestion.question as any).questionType !== "multiple_choice") && (
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <label className="text-xs text-gray-500 mb-2 block">你的答案</label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={currentQuestion.isCorrect === true || currentQuestion.isCorrect === false}
                placeholder="在此输入答案..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-base"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}

          {/* 反馈 */}
          {currentQuestion.feedback && (
            <div
              className={`p-4 rounded-xl ${
                currentQuestion.isCorrect
                  ? "bg-green-50 border border-green-100"
                  : "bg-red-50 border border-red-100"
              }`}
            >
              <div className="flex items-start gap-2">
                {currentQuestion.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <CircleX className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      currentQuestion.isCorrect ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {currentQuestion.isCorrect ? "回答正确！" : "再想想看"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{currentQuestion.feedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* 提示区域 */}
          {!currentQuestion.isCorrect && showHint && currentQuestion.question?.hints && (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  {Array.isArray(currentQuestion.question.hints) &&
                    currentQuestion.question.hints.slice(0, hintLevel).map((h: string, i: number) => (
                      <span key={i}>
                        提示 {i + 1}：{h}
                        {i < hintLevel - 1 && <br />}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="space-y-2">
            {currentQuestion.isCorrect === null && (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim() || grading}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {grading ? "批改中..." : "提交答案"}
                </button>
                {currentQuestion.question?.hints &&
                  Array.isArray(currentQuestion.question.hints) &&
                  hintLevel < (currentQuestion.question.hints as string[]).length && (
                    <button
                      onClick={handleShowHint}
                      className="px-4 py-3 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors"
                    >
                      <Lightbulb className="w-5 h-5" />
                    </button>
                  )}
              </div>
            )}

            {/* 做错了 → 重试 */}
            {currentQuestion.isCorrect === false && currentQuestion.attemptNumber < 2 && (
              <button
                onClick={handleRetry}
                className="w-full py-3 bg-amber-50 text-amber-700 rounded-xl font-medium border border-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                再试一次
              </button>
            )}

            {/* 做对了 或 重试已用完 → 下一题 */}
            {(currentQuestion.isCorrect === true || currentQuestion.attemptNumber >= 2) && (
              <button
                onClick={isLastQuestion ? handleComplete : handleNext}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLastQuestion ? (
                  <>
                    <Target className="w-4 h-4" />
                    查看结果
                  </>
                ) : (
                  <>
                    下一题
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
