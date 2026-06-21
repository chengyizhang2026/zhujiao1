// ============================================================
// 学习会话 API — 提交答案
// ============================================================

import { NextRequest } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const {
      sessionId,
      questionId,
      knowledgePointId,
      studentAnswer,
      isCorrect,
      timeSpentSeconds,
      hintsUsed = 0,
      attemptNumber = 1,
    } = body

    if (!questionId || studentAnswer === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 记录练习
    const { data: exercise, error: exerciseError } = await supabase
      .from("exercises")
      .insert({
        profile_id: user.id,
        question_id: questionId,
        session_id: sessionId,
        student_answer: studentAnswer,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds,
        hints_used: hintsUsed,
        attempt_number: attemptNumber,
      })
      .select()
      .single()

    if (exerciseError) {
      console.error("Exercise insert error:", exerciseError)
      return Response.json({ error: "Failed to record exercise" }, { status: 500 })
    }

    // 记录日志
    await supabase.from("learning_logs").insert({
      profile_id: user.id,
      log_date: new Date().toISOString().slice(0, 10),
      subject: "math",
      activity_type: "question_answered",
      detail: {
        exercise_id: exercise.id,
        question_id: questionId,
        is_correct: isCorrect,
        session_id: sessionId,
      },
    })

    // 如果做错了，创建或更新复习计划
    if (!isCorrect && knowledgePointId) {
      // 检查是否已有该题的复习计划
      const { data: existing } = await supabase
        .from("review_schedules")
        .select("id")
        .eq("profile_id", user.id)
        .eq("item_type", "mistake")
        .eq("item_id", exercise.id)
        .maybeSingle()

      if (!existing) {
        const nextReview = new Date()
        nextReview.setDate(nextReview.getDate() + 1) // 明天复习

        await supabase.from("review_schedules").insert({
          profile_id: user.id,
          item_type: "mistake",
          item_id: exercise.id,
          fsrs_state: {},
          next_review_at: nextReview.toISOString(),
          consecutive_correct: 0,
          is_mastered: false,
        })
      }
    }

    return Response.json({
      success: true,
      data: {
        exerciseId: exercise.id,
      },
    })
  } catch (error) {
    console.error("submit-answer error:", error)
    return Response.json({ error: "Failed to submit answer" }, { status: 500 })
  }
}
