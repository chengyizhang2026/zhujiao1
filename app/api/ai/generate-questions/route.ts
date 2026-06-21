import { NextRequest } from "next/server"
import { deepseek, DEEPSEEK_MODELS } from "@/lib/deepseek/client"
import { mathQuestionsPrompt } from "@/lib/deepseek/prompts/math-questions"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const {
      knowledgePoint,
      chapterContext,
      difficultyCounts = { basic: 2, consolidation: 2, advanced: 1 },
    } = body

    if (!knowledgePoint || !chapterContext) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { system, user: userPrompt } = mathQuestionsPrompt({
      knowledgePoint,
      chapterContext,
      difficultyCounts,
    })

    const completion = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODELS.chat,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
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
      return Response.json({ error: "AI returned invalid JSON" }, { status: 500 })
    }

    // questions在{questions:[...]}包装内
    const questions = (result.questions as unknown[]) || [result]
    return Response.json({
      success: true,
      data: { questions },
      usage: {
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      },
    })
  } catch (error) {
    console.error("generate-questions error:", error)
    return Response.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
