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
// 外研版英语七年级上册（2024新版）- 提取自教材PDF逐页内容
// 主编：孙有中；分册主编：张虹
// 每单元结构：Starting out → Understanding ideas(Reading+Grammar+Speaking) → Developing ideas(Listening&Speaking+Reading for writing) → Presenting ideas → Reflection
// ============================================================
export const ENGLISH_MODULES = [
  {
    id: "eng-starter",
    moduleNo: 0,
    title: "Welcome to junior high!",
    topic: "入门衔接：学校物品、科目、互相介绍、许愿树",
    grammar: ["名词(nouns)", "数字与冠词(numbers & articles)", "be动词一般现在时", "简单将来时(simple future tense)", "there be结构", "形容词(adjectives)"],
    reading: "",
    phonics: [],
    project: "Make a wishing tree",
    lessons: [
      "Get ready — 学校物品（textbook/eraser/pencil等）+ 数字1-12",
      "Know more about nouns & articles — 名词与冠词",
      "Subjects & simple present tense — 科目词汇 + be动词一般现在时",
      "Point and say — 穿着词汇 + 简单将来时(be going to)",
      "Know your school — 学校建筑（library/lab/playground等）+ there be结构",
      "Get to know each other — 自我介绍、问候语、生日月份",
      "Know more about adjectives — 形容词基本用法",
      "Write about yourself — 写自我介绍短文",
      "Make a wishing tree — 制作许愿树 + 新学期计划",
    ],
  },
  {
    id: "eng-u1",
    moduleNo: 1,
    title: "A new start",
    topic: "初中新起点：第一课的故事、时间规划、制作海报",
    grammar: ["人称代词主格与宾格(Pronouns)", "物主代词(my/your/his/her/mine/yours等)"],
    reading: "The first lesson — Wang Han corrects teacher's Confucius quote",
    phonics: ["/ɑː/ /æ/ /e/"],
    project: "Make a poster about your first week in junior high",
    lessons: [
      "Starting out — 各国开学习俗 + 初中生活问卷",
      "Understanding ideas: Reading — The first lesson（王涵的第一课：指出老师的错误）",
      "Understanding ideas: Think & Share — 孔子名言的含义：学而不思则罔",
      "Understanding ideas: Grammar — 人称代词主格/宾格 + 物主代词",
      "Understanding ideas: Speaking — Talk about a teacher you like（描述喜欢的老师）",
      "Developing ideas: Listening & Speaking — 新生问题（时间管理）+ 语音 /ɑː/ /æ/ /e/",
      "Developing ideas: Reading for writing — Before your journey starts（Mia父母的纸船信）",
      "Presenting ideas — 制作第一周海报 + Reflection",
    ],
  },
  {
    id: "eng-u2",
    moduleNo: 2,
    title: "More than fun",
    topic: "不止于乐趣：摇滚与二胡的碰撞、兴趣爱好",
    grammar: ["一般现在时-行为动词(Simple present tense)", "There be + 行为动词现在时"],
    reading: "Rock music meets the erhu — a boy combines rock with traditional Chinese instrument",
    phonics: ["/uː/ /ʊ/ /ʌ/"],
    project: "Make a plan for a school club",
    lessons: [
      "Starting out — 不同人的兴趣爱好 + 配对名人爱好",
      "Understanding ideas: Reading — Rock music meets the erhu（摇滚+二胡的跨界合作）",
      "Understanding ideas: Think & Share — 理解人物感受：从紧张到快乐",
      "Understanding ideas: Grammar — 行为动词一般现在时（肯定/否定/疑问）",
      "Understanding ideas: Speaking — Write about your hobby（描述你的爱好）",
      "Developing ideas: Listening & Speaking — 救助小鸟 + 语音 /uː/ /ʊ/ /ʌ/",
      "Developing ideas: Reading for writing — Emma's adventure（雨林冒险故事）",
      "Presenting ideas — 制定社团计划 + Reflection",
    ],
  },
  {
    id: "eng-u3",
    moduleNo: 3,
    title: "Family ties",
    topic: "家庭纽带：沉默的父爱、家庭照片",
    grammar: ["名词所有格(Possessive nouns: 's / of)"],
    reading: "Silent love — a film review about a father's unspoken love",
    phonics: ["/ɔː/ /ɒ/"],
    project: "Make a photo album about your family",
    lessons: [
      "Starting out — 家庭成员的职业与角色",
      "Understanding ideas: Reading — Silent love（影评：沉默的父爱——儿子背父亲过河）",
      "Understanding ideas: Think & Share — 对人物角色进行评论",
      "Understanding ideas: Grammar — 名词所有格 's / of",
      "Understanding ideas: Speaking — Talk about a family photo（讲述家庭照片故事）",
      "Developing ideas: Listening & Speaking — 家庭热线（与父母的沟通）+ 语音 /ɔː/ /ɒ/",
      "Developing ideas: Reading for writing — Racing together（兄弟情：越野赛）",
      "Presenting ideas — 制作家庭相册 + Reflection",
    ],
  },
  {
    id: "eng-u4",
    moduleNo: 4,
    title: "Time to celebrate",
    topic: "节日庆典：不寻常的春节、坚守岗位的人",
    grammar: ["频度副词(Adverbs of frequency: always/usually/often/sometimes/seldom/never)"],
    reading: "An unusual Spring Festival — a British girl experiences Chinese New Year",
    phonics: ["/eɪ/ /aɪ/ /ɔɪ/"],
    project: "Make a poster about a festival or holiday",
    lessons: [
      "Starting out — 世界各地的节日与庆祝方式",
      "Understanding ideas: Reading — An unusual Spring Festival（英国女孩体验春节：狮子头菜肴）",
      "Understanding ideas: Think & Share — 探索文化差异：中英节日对比",
      "Understanding ideas: Grammar — 频度副词（always→never）",
      "Understanding ideas: Speaking — Talk about ways to celebrate（描述节日庆祝方式）",
      "Developing ideas: Listening & Speaking — 圣诞节的环保问题 + 语音 /eɪ/ /aɪ/ /ɔɪ/",
      "Developing ideas: Reading for writing — When duty shines（冷文颖：节日坚守急诊室）",
      "Presenting ideas — 制作节日海报 + Reflection",
    ],
  },
  {
    id: "eng-u5",
    moduleNo: 5,
    title: "The power of plants",
    topic: "植物的力量：光合作用、玉米文化、茶文化",
    grammar: ["一般将来时(Simple future tense: will / be going to)"],
    reading: "Within a plant — a story about Worker No.55 in the Leaf workshop",
    phonics: ["/ɜː/ /ə/"],
    project: "Make a poster about plants",
    lessons: [
      "Starting out — 植物能为我们做什么 + 光合作用基础知识",
      "Understanding ideas: Reading — Within a plant（植物内部：绿叶工厂的工人No.55）",
      "Understanding ideas: Think & Share — 理解双关语(pun)：plant的双重含义",
      "Understanding ideas: Grammar — 一般将来时 will / be going to",
      "Understanding ideas: Speaking — Discuss a plan for planting（讨论种植计划）",
      "Developing ideas: Listening & Speaking — 玉米文化(corn silk) + 语音 /ɜː/ /ə/",
      "Developing ideas: Reading for writing — What's your cup of tea?（中英茶文化对比）",
      "Presenting ideas — 制作植物海报 + Reflection",
    ],
  },
  {
    id: "eng-u6",
    moduleNo: 6,
    title: "Fantastic friends",
    topic: "奇妙的朋友：鸽子的惊喜、英雄动物、渡渡鸟的灭绝",
    grammar: ["现在进行时(Present continuous tense: be + v-ing)"],
    reading: "Pigeon surprise — a boy discovers how clever pigeons really are",
    phonics: ["/ɜː/ /ə/"],
    project: "Make a profile of an animal",
    lessons: [
      "Starting out — Animal quiz（动物知识竞赛：最长脖子/最大动物等）",
      "Understanding ideas: Reading — Pigeon surprise（鸽子公园观察记：它们认得镜子里的自己！）",
      "Understanding ideas: Think & Share — 理解人物的想法和感受",
      "Understanding ideas: Grammar — 现在进行时(be + v-ing)",
      "Understanding ideas: Speaking — Do a voice-over for an animal video（动物视频配音）",
      "Developing ideas: Listening & Speaking — 英雄搜救犬 + 语音 /ɜː/ /ə/",
      "Developing ideas: Reading for writing — As dead as a dodo（渡渡鸟的灭绝）",
      "Presenting ideas — 制作动物简介 + Reflection",
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
