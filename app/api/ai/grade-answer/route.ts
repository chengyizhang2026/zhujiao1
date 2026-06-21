import { NextRequest } from "next/server"
import { deepseek, DEEPSEEK_MODELS } from "@/lib/deepseek/client"
import { mathGradingPrompt } from "@/lib/deepseek/prompts/math-grading"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { questionText, correctAnswer, studentAnswer, attemptNumber = 1, hintsUsed = 0 } = body

    if (!questionText || !correctAnswer || studentAnswer === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { system, user: userPrompt } = mathGradingPrompt({
      questionText,
      correctAnswer,
      studentAnswer,
      attemptNumber,
      hintsUsed,
    })

    const completion = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODELS.chat,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
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

    return Response.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("grade-answer error:", error)
    return Response.json({ error: "Failed to grade answer" }, { status: 500 })
  }
}
