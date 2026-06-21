// ============================================================
// 学习会话 API — 开始会话（诊→学）
// ============================================================

import { NextRequest } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { subject, knowledgePointId, chapterId } = body

    if (!subject || !knowledgePointId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 创建学习会话
    const { data: session, error: sessionError } = await supabase
      .from("learning_sessions")
      .insert({
        profile_id: user.id,
        subject,
        session_date: new Date().toISOString().slice(0, 10),
        phase: "diagnose",
        knowledge_point_id: knowledgePointId,
        is_completed: false,
      })
      .select()
      .single()

    if (sessionError) {
      console.error("Session creation error:", sessionError)
      return Response.json({ error: "Failed to create session" }, { status: 500 })
    }

    // 获取今日应复习的项目
    const { data: reviewItems } = await supabase
      .from("review_schedules")
      .select("*")
      .eq("profile_id", user.id)
      .eq("is_mastered", false)
      .lte("next_review_at", new Date().toISOString())
      .order("next_review_at", { ascending: true })
      .limit(10)

    // 记录学习日志
    await supabase.from("learning_logs").insert({
      profile_id: user.id,
      log_date: new Date().toISOString().slice(0, 10),
      subject,
      activity_type: "session_start",
      detail: { session_id: session.id, knowledge_point_id: knowledgePointId },
    })

    return Response.json({
      success: true,
      data: {
        sessionId: session.id,
        reviewItems: reviewItems || [],
        reviewCount: reviewItems?.length || 0,
      },
    })
  } catch (error) {
    console.error("start-session error:", error)
    return Response.json({ error: "Failed to start session" }, { status: 500 })
  }
}
