import { NextRequest } from "next/server"
import { deepseek, DEEPSEEK_MODELS } from "@/lib/deepseek/client"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const subject = url.searchParams.get("subject") || "math"

  const completion = await deepseek.chat.completions.create({
    model: DEEPSEEK_MODELS.chat,
    messages: [
      {
        role: "system",
        content:
          subject === "math"
            ? `你是一个出题老师。出1道关于正方体展开图的选择题。返回JSON对象：{"questions":[{"difficulty":"basic","questionType":"multiple_choice","questionText":"题目","options":["A...","B...","C...","D..."],"correctAnswer":"A","explanation":"解析","hints":["提示1"],"diagram":{"type":"cube_net","faces":["1","2","3","A","4","B"]}}]}。注意diagram必须是JSON对象（不是字符串），格式：{"type":"cube_net","faces":["上","下","左","前","右","后"]}。禁止LaTeX、禁止array、禁止图片URL！`
            : `Return JSON: {"questions":[{"questionText":"...","diagram":{...}}]}`,
      },
      { role: "user", content: "出1道题关于正方体展开图" },
    ],
    temperature: 0.3,
    max_tokens: 2048,
    response_format: { type: "json_object" },
  })

  const raw = completion.choices[0]?.message?.content || ""
  let parsed: unknown
  try { parsed = JSON.parse(raw) } catch { parsed = raw }

  return Response.json({
    raw,
    parsed,
    hasDiagram: !!(parsed as any)?.questions?.[0]?.diagram,
    diagramType: typeof (parsed as any)?.questions?.[0]?.diagram,
  })
}
