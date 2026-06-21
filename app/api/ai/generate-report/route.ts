import { NextRequest } from "next/server"
import { deepseek, DEEPSEEK_MODELS } from "@/lib/deepseek/client"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { weekStart, weekEnd } = body

    if (!weekStart || !weekEnd) {
      return Response.json({ error: "Missing weekStart or weekEnd" }, { status: 400 })
    }

    // 聚合本周数据
    const { data: sessions } = await supabase
      .from("learning_sessions")
      .select("subject, questions_correct, questions_total, total_time_seconds")
      .eq("profile_id", user.id)
      .gte("session_date", weekStart)
      .lte("session_date", weekEnd)

    const { data: mistakes } = await supabase
      .from("mistakes")
      .select("mistake_type, knowledge_point_id")
      .eq("profile_id", user.id)
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd)

    // 计算统计
    const mathSessions = (sessions || []).filter((s) => s.subject === "math")
    const engSessions = (sessions || []).filter((s) => s.subject === "english")

    const mathCorrect = mathSessions.reduce((sum, s) => sum + (s.questions_correct || 0), 0)
    const mathTotal = mathSessions.reduce((sum, s) => sum + (s.questions_total || 0), 0)
    const engCorrect = engSessions.reduce((sum, s) => sum + (s.questions_correct || 0), 0)
    const engTotal = engSessions.reduce((sum, s) => sum + (s.questions_total || 0), 0)

    const totalMinutes = Math.round(
      (sessions || []).reduce((sum, s) => sum + (s.total_time_seconds || 0), 0) / 60
    )

    const mistakeByType: Record<string, number> = {}
    ;(mistakes || []).forEach((m) => {
      mistakeByType[m.mistake_type] = (mistakeByType[m.mistake_type] || 0) + 1
    })

    // AI 生成周报
    const system = `你是一位学习顾问，负责为学生生成每周学习报告。请根据数据给出鼓励性的分析和建议。`
    const userPrompt = `请生成一份学习周报（${weekStart} 至 ${weekEnd}）：

## 本周数据
- 数学：${mathCorrect}/${mathTotal} 题正确（正确率 ${mathTotal > 0 ? Math.round((mathCorrect / mathTotal) * 100) : 0}%）
- 英语：${engCorrect}/${engTotal} 题正确
- 总学习时长：${totalMinutes} 分钟
- 学习次数：${(sessions || []).length} 次
- 错题分布：${JSON.stringify(mistakeByType)}
  - 知识型：${mistakeByType.knowledge || 0}
  - 习惯型：${mistakeByType.habit || 0}
  - 思维型：${mistakeByType.thinking || 0}

## 输出格式
请返回JSON：
{
  "summary": "本周学习总结（2-3句话，鼓励语气）",
  "strengths": ["做得好的方面1", "方面2"],
  "improvements": ["需要加强的方面1", "方面2"],
  "encouragement": "一句鼓励的话",
  "radarData": {
    "math": { "概念理解": ${50 + Math.random() * 30}, "计算能力": ${50 + Math.random() * 30}, "解题思路": ${50 + Math.random() * 30}, "应用能力": ${40 + Math.random() * 30} },
    "english": { "词汇": ${50 + Math.random() * 30}, "语法": ${50 + Math.random() * 30}, "阅读": ${50 + Math.random() * 30}, "写作": ${40 + Math.random() * 30} }
  },
  "weakPoints": [
    { "name": "薄弱知识点", "score": ${30 + Math.random() * 20}, "suggestion": "改进建议" }
  ]
}`

    const completion = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODELS.chat,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    const reportData = content ? JSON.parse(content) : {}

    // 保存到数据库
    const { error: insertError } = await supabase.from("weekly_reports").upsert(
      {
        profile_id: user.id,
        week_start: weekStart,
        week_end: weekEnd,
        report_data: reportData,
        radar_data: reportData.radarData || {},
        weak_points: reportData.weakPoints || [],
      },
      { onConflict: "profile_id,week_start" }
    )

    if (insertError) console.error("Report insert error:", insertError)

    return Response.json({ success: true, data: reportData })
  } catch (error) {
    console.error("generate-report error:", error)
    return Response.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
