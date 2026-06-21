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
// 外研版英语七年级上册（2024新版）— 模块目录（提取自教材PDF）
// 主编：孙有中；分册主编：张虹
// 单元结构：Starting out → Understanding ideas → Developing ideas → Presenting ideas → Reflection
// ============================================================
export const ENGLISH_MODULES = [
  {
    id: "eng-starter",
    moduleNo: 0,
    title: "Welcome to junior high!",
    topic: "入门衔接：认识学校、互相认识、制作许愿树",
    grammar: ["名词(nouns)", "数字与冠词(numbers & articles)", "be动词一般现在时", "there be结构"],
    reading: "",
    phonics: ["/ɑː/ /æ/ /e/"],
    project: "Making a poster about your first week in junior high",
    lessons: [
      "Get ready — 学校物品与数字",
      "Know your school — there be 结构",
      "Get to know each other — 互相介绍",
      "Make a wishing tree — 新学期愿望",
    ],
  },
  {
    id: "eng-u1",
    moduleNo: 1,
    title: "A new start",
    topic: "新学期开始：第一课、名人名言",
    grammar: ["人称代词主格与宾格(Pronouns)", "物主代词(形容词性/名词性)"],
    reading: "The first lesson",
    phonics: ["/iː/ /ɪ/ /i/"],
    project: "Making a poster about your first week in junior high",
    lessons: [
      "Starting out — 新学期感受",
      "Understanding ideas: The first lesson — 第一课的故事",
      "Grammar: Pronouns — 人称代词和物主代词",
      "Developing ideas: Listening & Speaking — 语音 /iː/ /ɪ/ /i/",
      "Developing ideas: Reading for writing — Emma's adventure",
      "Presenting ideas — 制作第一周海报",
      "Reflection — 自我评价",
    ],
  },
  {
    id: "eng-u2",
    moduleNo: 2,
    title: "More than fun",
    topic: "兴趣爱好的乐趣：摇滚与二胡",
    grammar: ["一般现在时（行为动词）(Simple present tense)"],
    reading: "Rock music meets the erhu",
    phonics: ["/uː/ /ʊ/ /ʌ/"],
    project: "Making a plan for a school club",
    lessons: [
      "Starting out — 兴趣爱好分享",
      "Understanding ideas: Rock music meets the erhu — 摇滚遇见二胡",
      "Grammar: Simple present tense — 行为动词一般现在时",
      "Developing ideas: Listening & Speaking — 语音 /uː/ /ʊ/ /ʌ/",
      "Developing ideas: Reading for writing — Saving the bird",
      "Presenting ideas — 制定社团计划",
      "Reflection — 自我评价",
    ],
  },
  {
    id: "eng-u3",
    moduleNo: 3,
    title: "Family ties",
    topic: "家庭纽带：沉默的父爱",
    grammar: ["名词所有格(Possessive nouns)", "名词所有格('s / of)"],
    reading: "Silent love",
    phonics: ["/ɔː/ /ɒ/"],
    project: "Making a photo album about your family",
    lessons: [
      "Starting out — 家庭成员介绍",
      "Understanding ideas: Silent love — 沉默的爱",
      "Grammar: Possessive nouns — 名词所有格",
      "Developing ideas: Listening & Speaking — 语音 /ɔː/ /ɒ/",
      "Developing ideas: Reading for writing — Racing together",
      "Presenting ideas — 制作家庭相册",
      "Reflection — 自我评价",
    ],
  },
  {
    id: "eng-u4",
    moduleNo: 4,
    title: "Time to celebrate",
    topic: "节日庆典：不寻常的春节",
    grammar: ["频度副词(Adverbs of frequency)"],
    reading: "An unusual Spring Festival",
    phonics: ["/eɪ/ /aɪ/ /ɔɪ/"],
    project: "Making a poster about a festival or holiday",
    lessons: [
      "Starting out — 节日与庆祝方式",
      "Understanding ideas: An unusual Spring Festival — 不寻常的春节",
      "Grammar: Adverbs of frequency — 频度副词",
      "Developing ideas: Listening & Speaking — 语音 /eɪ/ /aɪ/ /ɔɪ/",
      "Developing ideas: Reading for writing — When duty shines",
      "Presenting ideas — 制作节日海报",
      "Reflection — 自我评价",
    ],
  },
  {
    id: "eng-u5",
    moduleNo: 5,
    title: "The power of plants",
    topic: "植物的力量：植物内部奥秘、玉米与茶文化",
    grammar: ["一般将来时(Simple future tense)"],
    reading: "Within a plant",
    phonics: ["/eɪ/ /aɪ/ /ɔɪ/"],
    project: "Making a poster about plants",
    lessons: [
      "Starting out — 身边的植物",
      "Understanding ideas: Within a plant — 植物内部",
      "Grammar: Simple future tense — 一般将来时",
      "Developing ideas: Listening & Speaking — 语音 /eɪ/ /aɪ/ /ɔɪ/",
      "Developing ideas: Reading for writing — What's your cup of tea?",
      "Presenting ideas — 制作植物海报",
      "Reflection — 自我评价",
    ],
  },
  {
    id: "eng-u6",
    moduleNo: 6,
    title: "Fantastic friends",
    topic: "奇妙的朋友：鸽子与渡渡鸟",
    grammar: ["现在进行时(Present continuous tense)"],
    reading: "Pigeon surprise",
    phonics: ["/ɜː/ /ə/"],
    project: "Making a profile of an animal",
    lessons: [
      "Starting out — 人类的动物朋友",
      "Understanding ideas: Pigeon surprise — 鸽子的惊喜",
      "Grammar: Present continuous tense — 现在进行时",
      "Developing ideas: Listening & Speaking — 语音 /ɜː/ /ə/",
      "Developing ideas: Reading for writing — As dead as a dodo",
      "Presenting ideas — 制作动物简介",
      "Reflection — 自我评价",
    ],
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
