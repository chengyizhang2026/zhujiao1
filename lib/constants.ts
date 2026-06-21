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
// 外研版英语七年级上册（2024新版）— 模块目录
// ============================================================
export const ENGLISH_MODULES = [
  {
    id: "eng-starter",
    moduleNo: 0,
    title: "Welcome to junior high!",
    topic: "入门衔接：问候、介绍、课堂用语",
    grammar: ["be动词的一般现在时(am/is/are)"],
  },
  {
    id: "eng-u1",
    moduleNo: 1,
    title: "A new start",
    topic: "新学期、学校生活、日常活动",
    grammar: ["一般现在时（实义动词）"],
  },
  {
    id: "eng-u2",
    moduleNo: 2,
    title: "More than fun",
    topic: "兴趣爱好、课外活动",
    grammar: ["情态动词can/can't"],
  },
  {
    id: "eng-u3",
    moduleNo: 3,
    title: "Family ties",
    topic: "家庭关系、亲属称呼、家庭活动",
    grammar: ["名词所有格('s / of)"],
  },
  {
    id: "eng-u4",
    moduleNo: 4,
    title: "Time to celebrate",
    topic: "节日庆祝、传统习俗",
    grammar: ["there be句型"],
  },
  {
    id: "eng-u5",
    moduleNo: 5,
    title: "The power of plants",
    topic: "植物、自然、环境保护",
    grammar: ["时间介词(in/on/at)", "一般现在时巩固"],
  },
  {
    id: "eng-u6",
    moduleNo: 6,
    title: "Fantastic friends",
    topic: "朋友、人物描写、友谊",
    grammar: ["形容词的基本用法（作定语、表语）"],
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
