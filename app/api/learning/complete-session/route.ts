// ============================================================
// 学习会话 API — 完成会话 + 记录错题
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
      totalCorrect,
      totalWrong,
      totalTimeSeconds,
      mistakes, // Array: { exerciseId, questionId, knowledgePointId, mistakeType, analysis, avoidanceTip }
    } = body

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 })
    }

    // 更新会话
    const { error: updateError } = await supabase
      .from("learning_sessions")
      .update({
        phase: "remediate",
        is_completed: true,
        questions_total: (totalCorrect || 0) + (totalWrong || 0),
        questions_correct: totalCorrect || 0,
        total_time_seconds: totalTimeSeconds || 0,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("profile_id", user.id)

    if (updateError) {
      console.error("Session update error:", updateError)
    }

    // 记录错题
    if (mistakes && Array.isArray(mistakes) && mistakes.length > 0) {
      for (const m of mistakes) {
        const { error: mistakeError } = await supabase.from("mistakes").insert({
          profile_id: user.id,
          exercise_id: m.exerciseId,
          question_id: m.questionId,
          knowledge_point_id: m.knowledgePointId,
          mistake_type: m.mistakeType || "knowledge",
          ai_analysis: m.analysis || null,
          avoidance_tip: m.avoidanceTip || null,
          source: "system",
          is_remediated: false,
        })

        if (mistakeError) {
          console.error("Mistake insert error:", mistakeError)
        }
      }

      // 记录日志
      await supabase.from("learning_logs").insert({
        profile_id: user.id,
        log_date: new Date().toISOString().slice(0, 10),
        subject: "math",
        activity_type: "mistake_recorded",
        detail: { count: mistakes.length, session_id: sessionId },
      })
    }

    // 计算今天的学习统计
    const today = new Date().toISOString().slice(0, 10)
    const { count: todayCorrect } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id)
      .eq("is_correct", true)
      .gte("created_at", today)

    const { count: todayTotal } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id)
      .gte("created_at", today)

    const accuracy = todayTotal ? Math.round((todayCorrect || 0) / todayTotal * 100) : 0

    return Response.json({
      success: true,
      data: {
        todayAccuracy: accuracy,
        todayTotal: todayTotal || 0,
        todayCorrect: todayCorrect || 0,
        message: accuracy >= 80
          ? "太棒了！今天的正确率很高，继续保持！"
          : accuracy >= 60
          ? "还不错！把错题好好看看，明天复习一下。"
          : "别灰心！错题是最好的老师，明天我们再来攻克它们。",
      },
    })
  } catch (error) {
    console.error("complete-session error:", error)
    return Response.json({ error: "Failed to complete session" }, { status: 500 })
  }
}
