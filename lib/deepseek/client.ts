// ============================================================
// DeepSeek API 客户端
// 使用 OpenAI SDK，baseURL 指向 DeepSeek
// ============================================================

import OpenAI from "openai"

// 懒加载 DeepSeek 客户端（避免 build 时初始化报错）
let _deepseek: OpenAI | null = null

function getDeepSeekClient(): OpenAI {
  if (!_deepseek) {
    _deepseek = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY!,
      baseURL: "https://api.deepseek.com/v1",
    })
  }
  return _deepseek
}

// 导出便捷访问器
export const deepseek = new Proxy({} as OpenAI, {
  get(_, prop) {
    return getDeepSeekClient()[prop as keyof OpenAI]
  },
})

// 两个模型：
// - deepseek-chat: 通用对话，快速，适合内容生成
// - deepseek-reasoner: 推理模型，适合数学证明和复杂问题
export const DEEPSEEK_MODELS = {
  chat: "deepseek-chat",
  reasoner: "deepseek-reasoner",
} as const

// DeepSeek API 价格（RMB / 百万 token）
// 注意：缓存命中时输入价格减半
const PRICING = {
  "deepseek-chat": {
    input: 2, // RMB / 1M tokens (cache miss)
    inputCached: 0.5, // RMB / 1M tokens (cache hit)
    output: 8, // RMB / 1M tokens
  },
  "deepseek-reasoner": {
    input: 4,
    inputCached: 1,
    output: 16,
  },
} as const

// 计算 API 调用成本（人民币）
export function estimateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
  cacheHit: boolean = false
): number {
  const pricing =
    PRICING[model as keyof typeof PRICING] || PRICING["deepseek-chat"]
  const inputPrice = cacheHit ? pricing.inputCached : pricing.input
  return (
    (promptTokens / 1_000_000) * inputPrice +
    (completionTokens / 1_000_000) * pricing.output
  )
}

// JSON schema 辅助 — 要求 DeepSeek 返回结构化 JSON
export function jsonPrompt(instruction: string) {
  return `${instruction}\n\n请直接返回 JSON 格式，不要包含其他文字。`
}
