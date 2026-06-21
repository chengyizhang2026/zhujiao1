// ============================================================
// 助教智能体 — 应用常量
// ============================================================

import { BookOpen, Languages } from "lucide-react"

export const APP_NAME = "助教智能体"
export const APP_SHORT_NAME = "助教"
export const APP_DESCRIPTION = "AI驱动的中学学习助手"

// 科目
export const SUBJECTS = {
  math: {
    key: "math" as const,
    label: "数学",
    icon: "📐",
    color: "blue",
    textbook: "北师大版七年级上册",
  },
  english: {
    key: "english" as const,
    label: "英语",
    icon: "🌍",
    color: "green",
    textbook: "外研版七年级上册",
  },
} as const

export type SubjectKey = keyof typeof SUBJECTS

// ============================================================
// 北师大版数学七年级上册 — 章节目录
// ============================================================
export const MATH_CHAPTERS = [
  {
    id: "math-01",
    chapterNo: 1,
    title: "丰富的图形世界",
    knowledgePoints: [
      "生活中的立体图形",
      "展开与折叠",
      "截一个几何体",
      "从三个方向看物体的形状",
    ],
  },
  {
    id: "math-02",
    chapterNo: 2,
    title: "有理数及其运算",
    knowledgePoints: [
      "正数和负数",
      "数轴",
      "相反数",
      "绝对值",
      "有理数的加法",
      "有理数的减法",
      "有理数的加减混合运算",
      "有理数的乘法",
      "有理数的除法",
      "有理数的乘方",
      "科学记数法",
      "有理数的混合运算",
    ],
  },
  {
    id: "math-03",
    chapterNo: 3,
    title: "整式及其加减",
    knowledgePoints: [
      "用字母表示数",
      "代数式",
      "整式",
      "合并同类项",
      "去括号",
      "整式的加减",
      "探索规律",
    ],
  },
  {
    id: "math-04",
    chapterNo: 4,
    title: "基本平面图形",
    knowledgePoints: [
      "线段、射线、直线",
      "比较线段的长短",
      "角",
      "角的比较",
      "多边形和圆的初步认识",
    ],
  },
  {
    id: "math-05",
    chapterNo: 5,
    title: "一元一次方程",
    knowledgePoints: [
      "认识一元一次方程",
      "求解一元一次方程",
      "应用一元一次方程——水箱变高了",
      "应用一元一次方程——打折销售",
      "应用一元一次方程——「希望工程」义演",
      "应用一元一次方程——行程问题",
    ],
  },
  {
    id: "math-06",
    chapterNo: 6,
    title: "数据的收集与整理",
    knowledgePoints: [
      "数据的收集",
      "普查和抽样调查",
      "数据的表示",
      "统计图的选择",
    ],
  },
]

// ============================================================
// 外研版英语七年级上册 — 模块目录
// ============================================================
export const ENGLISH_MODULES = [
  {
    id: "eng-m1",
    moduleNo: 1,
    title: "My classmates",
    topic: "个人情况、问候与介绍",
    grammar: ["be动词(am/is/are)", "人称代词主格(I/you/he/she/it/we/they)"],
  },
  {
    id: "eng-m2",
    moduleNo: 2,
    title: "My family",
    topic: "家庭与亲属关系",
    grammar: ["指示代词(this/that/these/those)", "名词所有格('s)"],
  },
  {
    id: "eng-m3",
    moduleNo: 3,
    title: "My school",
    topic: "学校设施与方位",
    grammar: ["There be句型", "方位介词(in/on/behind/next to等)"],
  },
  {
    id: "eng-m4",
    moduleNo: 4,
    title: "Healthy food",
    topic: "食物与健康饮食",
    grammar: ["have got的用法", "some/any的用法", "可数与不可数名词"],
  },
  {
    id: "eng-m5",
    moduleNo: 5,
    title: "My school day",
    topic: "学校日常与时间表达",
    grammar: ["一般现在时(I/we/you/they)", "时间介词(at/in/on)"],
  },
  {
    id: "eng-m6",
    moduleNo: 6,
    title: "A trip to the zoo",
    topic: "动物与动物园",
    grammar: ["一般现在时(he/she/it/单数第三人称)"],
  },
  {
    id: "eng-m7",
    moduleNo: 7,
    title: "Computers",
    topic: "电脑与科技",
    grammar: ["一般现在时的疑问句", "Wh-特殊疑问句"],
  },
  {
    id: "eng-m8",
    moduleNo: 8,
    title: "Choosing presents",
    topic: "生日与礼物",
    grammar: ["频度副词(always/usually/often/sometimes/never)", "一般现在时复习"],
  },
  {
    id: "eng-m9",
    moduleNo: 9,
    title: "People and places",
    topic: "人物与地点",
    grammar: ["现在进行时(be + v-ing)"],
  },
  {
    id: "eng-m10",
    moduleNo: 10,
    title: "Spring Festival",
    topic: "春节与传统节日",
    grammar: ["现在进行时的一般疑问句和特殊疑问句", "现在进行时与一般现在时对比"],
  },
]

// 难度等级
export const DIFFICULTY = {
  basic: { key: "basic", label: "基础", color: "green" },
  consolidation: { key: "consolidation", label: "巩固", color: "yellow" },
  advanced: { key: "advanced", label: "拔高", color: "red" },
} as const

// 错因分类
export const MISTAKE_TYPES = {
  knowledge: {
    key: "knowledge",
    label: "知识型",
    emoji: "🔴",
    description: "概念混淆、公式记错、定理理解有误",
  },
  habit: {
    key: "habit",
    label: "习惯型",
    emoji: "🟡",
    description: "计算跳步、审题不清、漏看条件",
  },
  thinking: {
    key: "thinking",
    label: "思维型",
    emoji: "🔵",
    description: "思路偏差、方法选择不当、漏解或多解",
  },
} as const

// SM-2 复习间隔（天）
export const REVIEW_INTERVALS = [1, 3, 7, 15, 30]

// 底部导航
export const BOTTOM_NAV_ITEMS = [
  { key: "dashboard", label: "首页", href: "/dashboard", icon: "Home" },
  { key: "math", label: "数学", href: "/math", icon: "BookOpen" },
  { key: "english", label: "英语", href: "/english", icon: "Languages" },
  { key: "mistakes", label: "错题本", href: "/mistakes", icon: "FileX" },
  { key: "reports", label: "报告", href: "/reports", icon: "BarChart3" },
] as const
