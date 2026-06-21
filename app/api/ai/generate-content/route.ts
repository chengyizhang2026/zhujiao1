import { NextRequest } from "next/server"
import { deepseek, DEEPSEEK_MODELS } from "@/lib/deepseek/client"
import { mathLearningPrompt } from "@/lib/deepseek/prompts/math-learning"
import { englishGrammarPrompt } from "@/lib/deepseek/prompts/english-grammar"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { chapterTitle, knowledgePoint, previousKnowledge = [], subject = "math" } = body

    if (!knowledgePoint || !chapterTitle) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isEnglish = subject === "english"
    const { system, user: userPrompt } = isEnglish
      ? englishGrammarPrompt({ chapterTitle, knowledgePoint })
      : mathLearningPrompt({ chapterTitle, knowledgePoint, previousKnowledge, studentLevel: "七年级" })

    const completion = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODELS.chat,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return Response.json({ error: "AI returned empty response" }, { status: 500 })
    }

    let result: Record<string, unknown>
    try {
      result = JSON.parse(content)
    } catch {
      return Response.json({ error: "AI returned invalid JSON", raw: content }, { status: 500 })
    }

    return Response.json({
      success: true,
      data: result,
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      },
    })
  } catch (error) {
    console.error("generate-content error:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
