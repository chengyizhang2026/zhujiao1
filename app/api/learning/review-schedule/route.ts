// ============================================================
// 学习模块 API — 获取今日复习队列
// ============================================================

import { NextRequest } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const url = new URL(request.url)
    const subject = url.searchParams.get("subject")

    let query = supabase
      .from("review_schedules")
      .select(`
        *,
        mistakes:item_id (
          id, question_id, knowledge_point_id, mistake_type, avoidance_tip,
          questions:question_id (question_text, correct_answer, difficulty)
        )
      `)
      .eq("profile_id", user.id)
      .eq("is_mastered", false)
      .lte("next_review_at", new Date().toISOString())
      .order("next_review_at", { ascending: true })
      .limit(20)

    const { data: items, error } = await query

    if (error) {
      console.error("Review schedule error:", error)
      return Response.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return Response.json({
      success: true,
      data: {
        items: items || [],
        totalDue: items?.length || 0,
      },
    })
  } catch (error) {
    console.error("review-schedule error:", error)
    return Response.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}
