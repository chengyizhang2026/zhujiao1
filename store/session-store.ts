// ============================================================
// 学习会话状态管理 (Zustand)
// ============================================================

import { create } from "zustand"
import type {
  SessionPhase,
  Question as QuestionType,
} from "@/lib/types/database"

// 单道题的答题状态
export interface QuestionState {
  question: QuestionType | null
  studentAnswer: string
  isCorrect: boolean | null
  attemptNumber: number
  hintsUsed: number
  feedback: string | null
  showExplanation: boolean
  timeSpentSeconds: number
}

// 会话状态
interface SessionState {
  // 会话信息
  sessionId: string | null
  subject: "math" | "english" | null
  chapterId: string | null
  knowledgePoint: string | null
  phase: SessionPhase
  isActive: boolean

  // 学习内容
  learningContent: {
    explanation: string
    keyPoints: string[]
    commonMistakes: { mistake: string; correction: string }[]
    memoryTip: string
    examples: { question: string; solution: string }[]
    realLifeConnection: string
    mindMapMermaid: string
  } | null

  // 练习题
  questions: QuestionState[]
  currentQuestionIndex: number

  // 统计
  totalCorrect: number
  totalWrong: number
  sessionStartTime: number | null

  // 错题分析
  mistakeAnalyses: Array<{
    questionIndex: number
    mistakeType: string
    analysis: string
    avoidanceTip: string
  }>

  // Actions
  startSession: (params: {
    subject: "math" | "english"
    chapterId: string
    knowledgePoint: string
  }) => void
  setLearningContent: (content: SessionState["learningContent"]) => void
  setQuestions: (questions: QuestionType[]) => void
  answerQuestion: (answer: string) => void
  setGradingResult: (index: number, result: { isCorrect: boolean; feedback: string }) => void
  retryQuestion: (index: number) => void
  nextQuestion: () => void
  setPhase: (phase: SessionPhase) => void
  addMistakeAnalysis: (analysis: SessionState["mistakeAnalyses"][0]) => void
  endSession: () => void
  reset: () => void
}

const initialState = {
  sessionId: null,
  subject: null as SessionState["subject"],
  chapterId: null as string | null,
  knowledgePoint: null,
  phase: "diagnose" as SessionPhase,
  isActive: false,
  learningContent: null,
  questions: [],
  currentQuestionIndex: 0,
  totalCorrect: 0,
  totalWrong: 0,
  sessionStartTime: null,
  mistakeAnalyses: [],
}

export const useSessionStore = create<SessionState>((set, get) => ({
  ...initialState,

  startSession: ({ subject, chapterId, knowledgePoint }) =>
    set({
      isActive: true,
      subject,
      chapterId,
      knowledgePoint,
      phase: "diagnose",
      sessionStartTime: Date.now(),
      currentQuestionIndex: 0,
      totalCorrect: 0,
      totalWrong: 0,
      questions: [],
      learningContent: null,
      mistakeAnalyses: [],
    }),

  setLearningContent: (content) => set({ learningContent: content }),

  setQuestions: (questions) =>
    set({
      questions: questions.map((q) => ({
        question: q,
        studentAnswer: "",
        isCorrect: null,
        attemptNumber: 0,
        hintsUsed: 0,
        feedback: null,
        showExplanation: false,
        timeSpentSeconds: 0,
      })),
      phase: "practice",
    }),

  answerQuestion: (answer) => {
    const { currentQuestionIndex, questions } = get()
    const updated = [...questions]
    if (updated[currentQuestionIndex]) {
      updated[currentQuestionIndex] = {
        ...updated[currentQuestionIndex],
        studentAnswer: answer,
        attemptNumber: updated[currentQuestionIndex].attemptNumber + 1,
      }
    }
    set({ questions: updated })
  },

  setGradingResult: (index, result) => {
    const updated = [...get().questions]
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        isCorrect: result.isCorrect,
        feedback: result.feedback,
      }
    }
    set({
      questions: updated,
      totalCorrect: updated.filter((q) => q.isCorrect === true).length,
      totalWrong: updated.filter((q) => q.isCorrect === false).length,
    })
  },

  retryQuestion: (index) => {
    const updated = [...get().questions]
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        studentAnswer: "",
        isCorrect: null,
        feedback: null,
      }
    }
    set({ questions: updated })
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get()
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 })
    }
  },

  setPhase: (phase) => set({ phase }),

  addMistakeAnalysis: (analysis) =>
    set({ mistakeAnalyses: [...get().mistakeAnalyses, analysis] }),

  endSession: () =>
    set({
      isActive: false,
      phase: "remediate",
    }),

  reset: () => set(initialState),
}))
