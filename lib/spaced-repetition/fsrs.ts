// ============================================================
// FSRS 间隔复习调度器（ts-fsrs 封装）
// ============================================================

import { FSRS, createEmptyCard, Rating, type Card, type Grade } from "ts-fsrs"

const f = new FSRS({})

// UI 质量评分 0-5 → ts-fsrs Rating (1-4)
export function qualityToRating(quality: number): Rating {
  if (quality <= 1) return Rating.Again  // 做错了/忘了 → Again
  if (quality <= 3) return Rating.Hard   // 做对了但很犹豫 → Hard
  if (quality === 4) return Rating.Good  // 做对了稍犹豫 → Good
  return Rating.Easy                      // 秒解 → Easy
}

// Rating → 显示文本
export function ratingLabel(r: Rating): string {
  switch (r) {
    case Rating.Easy: return "太简单"
    case Rating.Good: return "正常"
    case Rating.Hard: return "困难"
    case Rating.Again: return "重来"
    default: return "未知"
  }
}

// 创建新卡片
export function newCard(): Card {
  return createEmptyCard()
}

// 复习卡片
export function reviewCard(
  card: Card,
  quality: number
): { card: Card; nextReviewDays: number } {
  const rating = qualityToRating(quality)
  const now = new Date()
  const result = f.next(card, now, rating as unknown as Grade)

  const nextReviewDays = Math.max(
    1,
    Math.round(
      (result.card.due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
  )

  return { card: result.card, nextReviewDays }
}

// 格式化间隔
export function formatInterval(days: number): string {
  if (days <= 0) return "今天"
  if (days === 1) return "明天"
  if (days < 7) return `${days}天后`
  if (days < 30) return `${Math.round(days / 7)}周后`
  if (days < 365) return `${Math.round(days / 30)}个月后`
  return `${Math.round(days / 365)}年后`
}

// 判断是否已掌握
export function isMastered(consecutiveCorrect: number, intervalDays: number): boolean {
  return consecutiveCorrect >= 3 && intervalDays >= 30
}

// Serialize Card → JSON (for DB)
export function cardToJSON(card: Card): Record<string, unknown> {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review?.toISOString() ?? undefined,
  }
}

// Deserialize JSON → Card
export function cardFromJSON(json: Record<string, unknown>): Card {
  const card = createEmptyCard()
  card.due = new Date(json.due as string)
  card.stability = json.stability as number
  card.difficulty = json.difficulty as number
  card.elapsed_days = json.elapsed_days as number
  card.scheduled_days = json.scheduled_days as number
  card.reps = json.reps as number
  card.lapses = json.lapses as number
  card.state = json.state as number
  if (json.last_review && json.last_review !== null) {
    card.last_review = new Date(json.last_review as string)
  }
  return card
}
