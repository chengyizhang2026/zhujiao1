// ============================================================
// 数据库类型定义
// ============================================================

export interface Profile {
  id: string
  role: "parent" | "student"
  display_name: string
  grade: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SubjectSetting {
  id: string
  profile_id: string
  subject: "math" | "english"
  textbook_name: string
  is_active: boolean
  created_at: string
}

export interface Chapter {
  id: string
  subject: "math" | "english"
  textbook: string
  chapter_no: number
  title: string
  sort_order: number
  created_at: string
}

export interface KnowledgePoint {
  id: string
  chapter_id: string
  subject: "math" | "english"
  title: string
  description: string | null
  difficulty: "basic" | "intermediate" | "advanced"
  sort_order: number
  created_at: string
}

export interface KnowledgePrerequisite {
  id: string
  knowledge_point_id: string
  prerequisite_id: string
}

export interface MindMap {
  id: string
  chapter_id: string
  mermaid_syntax: string
  generated_at: string
}

export type QuestionType =
  | "multiple_choice"
  | "fill_blank"
  | "short_answer"
  | "calculation"
  | "true_false"
  | "error_correction"
  | "translation"
  | "dictation"
  | "reading_comprehension"

export type QuestionDifficulty = "basic" | "consolidation" | "advanced"

export type SubjectType = "math" | "english"

export interface Question {
  id: string
  knowledge_point_id: string
  difficulty: QuestionDifficulty
  question_type: QuestionType
  question_text: string
  options: string[] | null
  correct_answer: string
  answer_explanation: string | null
  hints: string[] | null
  metadata: Record<string, unknown> | null
  created_by: string
  created_at: string
  // AI-generated responses may use camelCase
  [key: string]: unknown
}

export interface Exercise {
  id: string
  profile_id: string
  question_id: string
  session_id: string | null
  student_answer: string | null
  is_correct: boolean | null
  time_spent_seconds: number | null
  hints_used: number
  attempt_number: number
  created_at: string
}

export type MistakeType = "knowledge" | "habit" | "thinking"
export type MistakeSource = "system" | "photo_upload"

export interface Mistake {
  id: string
  profile_id: string
  exercise_id: string
  question_id: string
  knowledge_point_id: string
  mistake_type: MistakeType
  ai_analysis: string | null
  avoidance_tip: string | null
  source: MistakeSource
  photo_url: string | null
  is_remediated: boolean
  remediated_at: string | null
  similar_question_id: string | null
  created_at: string
}

export type ReviewItemType = "knowledge_point" | "mistake" | "vocabulary"

export interface ReviewSchedule {
  id: string
  profile_id: string
  item_type: ReviewItemType
  item_id: string
  fsrs_state: Record<string, unknown>
  next_review_at: string
  last_review_at: string | null
  consecutive_correct: number
  is_mastered: boolean
  mastered_at: string | null
  created_at: string
  updated_at: string
}

export interface ReviewLog {
  id: string
  schedule_id: string
  quality: number
  rating_at: string
  time_spent_seconds: number | null
}

export interface Vocabulary {
  id: string
  chapter_id: string
  word: string
  part_of_speech: string | null
  chinese_meaning: string
  phonetic: string | null
  example_sentence: string | null
  difficulty: string
  created_at: string
}

export interface VocabReview {
  id: string
  profile_id: string
  vocabulary_id: string
  review_direction: "en_to_cn" | "cn_to_en"
  fsrs_state: Record<string, unknown>
  next_review_at: string
  last_review_at: string | null
  consecutive_correct: number
  created_at: string
}

export interface ReadingPassage {
  id: string
  chapter_id: string
  title: string
  passage_text: string
  difficulty: "easy" | "medium" | "hard"
  word_count: number
  questions: ReadingQuestion[]
  difficult_sentences: DifficultSentence[] | null
  created_by: string
  created_at: string
}

export interface ReadingQuestion {
  q: string
  options?: string[]
  answer: string
}

export interface DifficultSentence {
  sentence: string
  grammar_analysis: string
}

export interface ListeningExercise {
  id: string
  chapter_id: string
  title: string
  transcript: string
  exercise_type: "dictation" | "keyword_fill" | "comprehension"
  audio_generated: boolean
  questions: Record<string, unknown>[]
  created_at: string
}

export interface WritingExercise {
  id: string
  profile_id: string
  topic: string
  student_text: string | null
  ai_correction: WritingCorrection | null
  submitted_at: string | null
  corrected_at: string | null
  created_at: string
}

export interface WritingCorrection {
  corrected_text: string
  grammar_errors: GrammarError[]
  word_choice_suggestions: WordChoiceSuggestion[]
  sentence_variety: string
  overall_score: number
}

export interface GrammarError {
  original: string
  corrected: string
  explanation: string
}

export interface WordChoiceSuggestion {
  original: string
  suggestion: string
  reason: string
}

export type SessionPhase = "diagnose" | "learn" | "practice" | "assess" | "remediate"

export interface LearningSession {
  id: string
  profile_id: string
  subject: string
  session_date: string
  phase: SessionPhase
  knowledge_point_id: string | null
  is_completed: boolean
  questions_total: number
  questions_correct: number
  total_time_seconds: number
  created_at: string
  completed_at: string | null
}

export interface LearningLog {
  id: string
  profile_id: string
  log_date: string
  subject: string
  activity_type:
    | "session_start"
    | "knowledge_learned"
    | "question_answered"
    | "mistake_recorded"
    | "review_completed"
    | "vocab_practiced"
    | "reading_completed"
    | "listening_completed"
    | "writing_submitted"
  detail: Record<string, unknown> | null
  created_at: string
}

export interface WeeklyReport {
  id: string
  profile_id: string
  week_start: string
  week_end: string
  report_data: Record<string, unknown>
  radar_data: Record<string, Record<string, number>>
  weak_points: WeakPoint[]
  created_at: string
}

export interface WeakPoint {
  knowledge_point_id: string
  score: number
  alert_level: "low" | "medium" | "high"
}

export interface NextWeekPlan {
  id: string
  weekly_report_id: string
  plan_data: Record<string, unknown>
  created_at: string
}

export interface ApiUsage {
  id: string
  endpoint: string
  model: string
  prompt_tokens: number
  completion_tokens: number
  estimated_cost_rmb: number
  created_at: string
}
