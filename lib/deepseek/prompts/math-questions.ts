// ============================================================
// 数学练习题生成提示词
// ============================================================

export function mathQuestionsPrompt(params: {
  knowledgePoint: string
  chapterContext: string
  difficultyCounts: { basic: number; consolidation: number; advanced: number }
}): { system: string; user: string } {
  const system = `你是一位经验丰富的初中数学出题老师，擅长出分层练习题目。

## 难度定义
- **基础（basic）**：直接考察知识点本身的概念理解和公式套用，一步即可完成
- **巩固（consolidation）**：需要结合1-2个已学知识，两步推理
- **拔高（advanced）**：需要多步推理、灵活应用，可能有陷阱

## 题型
- multiple_choice：选择题（4个选项，含干扰项）
- fill_blank：填空题
- calculation：计算题（需写出步骤）

## 输出格式
返回一个JSON对象，包含questions数组：
{
  "questions": [
    {
      "difficulty": "basic|consolidation|advanced",
      "questionType": "multiple_choice|fill_blank|calculation",
      "questionText": "题目（Markdown格式，LaTeX数学公式用$...$）",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "正确答案",
      "explanation": "详细解题步骤",
      "hints": ["提示1", "提示2"],
      "knowledgeTag": "考察的子知识点",
      "diagram": {}
    }
  ]
}

## diagram字段说明
几何题必须填diagram（JSON对象），非几何题设为null。
- 展开图：{"type":"cube_net","grid":[["F"],["E","A","C"],["B"],["D"]]}
  grid是2D数组，每行一个数组，null=空格，字符串=面上的文字
  ⚠️ 正方体展开图必须有且仅有6个面（grid中必须恰好有6个非null单元格）！
  按题目实际展开图排列每个面的位置，不要遗漏任何面！
- 数轴：{"type":"number_line","from":-3,"to":3,"points":[{"value":-1,"label":"A"}]}
- 三角形：{"type":"triangle","vertices":["A","B","C"]}
- 角：{"type":"angle","vertex":"O","rays":["A","B"],"angle":"45°"}
⚠️ 绝对禁止图片URL！必须用这个diagram JSON格式！

## 出题原则
1. 干扰项要合理（反映常见错误认知）
2. hint要逐步递进，先引导思路再给暗示，绝不直接给答案
3. 题干清晰，数据合理，计算不繁琐
4. 每道题都要让学生思考，不能是机械运算
5. 拔高题要设计"陷阱"或需要仔细审题
6. 题干中可以用"如图所示（见下图）"，但必须配svgDiagram字段`

  const user = `请为以下知识点出题：

**知识点**：${params.knowledgePoint}
**章节背景**：${params.chapterContext}
**题目分布**：
- 基础题：${params.difficultyCounts.basic}道
- 巩固题：${params.difficultyCounts.consolidation}道
- 拔高题：${params.difficultyCounts.advanced}道

注意：
1. 题目要体现"基础→巩固→拔高"的难度递进
2. 拔高题需要结合本知识点和之前已学内容的综合应用
3. 选择题的干扰项要精准对应学生的常见错误认知`

  return { system, user }
}

// ============================================================
// 举一反三 — 同类题和变式题生成
// ============================================================

export function similarQuestionsPrompt(params: {
  originalQuestion: string
  correctAnswer: string
  studentAnswer: string
  mistakeType: string
  knowledgePoint: string
}): { system: string; user: string } {
  const system = `你是一位擅长出"举一反三"题目的数学老师。
当学生做错一道题时，你能生成结构相似但数据/问法不同的题目，帮助学生验证是否真正掌握。

## 输出格式
请严格返回JSON：
{
  "similarQuestions": [
    {
      "questionText": "同类型题（换数据/场景，考察同一知识点同一种问法）",
      "questionType": "calculation|fill_blank|multiple_choice",
      "options": ["A...", "B...", "C...", "D..."],
      "correctAnswer": "答案",
      "explanation": "解题步骤",
      "hints": ["提示1", "提示2"],
      "diagram": "几何图形参数JSON（格式同出题要求，非几何题为null）"
    }
  ],
  "variantQuestions": [
    {
      "questionText": "变式题（不同问法/逆向思维/增加条件，考察同一知识点）",
      "questionType": "calculation|fill_blank|multiple_choice",
      "options": ["A...", "B...", "C...", "D..."],
      "correctAnswer": "答案",
      "explanation": "解题步骤",
      "hints": ["提示1", "提示2"],
      "diagram": "几何图形参数JSON（格式同出题要求，非几何题为null）"
    }
  ]
}

## 出题原则
- 同类题：只改数据和场景，结构不变，确认学生不是"记住了答案"
- 变式题：换个角度问，或反过来给答案求条件，测试是否真正理解概念
- 每种各出2道
- 几何题用diagram字段（JSON参数），不用图片URL`

  const user = `学生做错了下面这道题，请生成的"举一反三"题目：

**原题**：${params.originalQuestion}
**正确答案**：${params.correctAnswer}
**学生错误答案**：${params.studentAnswer}
**错因类型**：${params.mistakeType}
**所属知识点**：${params.knowledgePoint}

请确保新题目：
1. 针对学生的具体错误思路设计
2. 同类题帮助学生巩固正确解法
3. 变式题验证学生是否真正理解，而非死记硬背`

  return { system, user }
}
