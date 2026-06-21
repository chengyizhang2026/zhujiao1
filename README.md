# 助教智能体

AI驱动的中学学习助手 — 覆盖北师大版数学七年级上册和外研版英语七年级上册。

## 功能

- 📖 **每日学习**：AI生成知识点讲解 + 思维导图 + 重点标注 + 记忆口诀
- 📝 **智能练习**：三级难度（基础/巩固/拔高）5题训练，先提示后答案
- ❌ **错题本**：自动收录错题，三分类分析（知识型/习惯型/思维型）
- 🔄 **举一反三**：针对每道错题生成同类题和变式题
- 🧠 **间隔复习**：FSRS科学复习算法（1→3→7→15→30天）
- 🌍 **英语五大模块**：单词闪卡/语法/阅读/听力/写作
- 📊 **周报**：AI生成学习分析 + 雷达图 + 薄弱点预警

## 技术栈

- Next.js 16 (App Router) + TypeScript
- Supabase (PostgreSQL + Auth)
- DeepSeek API (AI引擎)
- Tailwind CSS v4 + PWA

## 部署步骤

### 1. 注册账号
- [Supabase](https://supabase.com) — 免费数据库
- [Vercel](https://vercel.com) — 免费部署
- [DeepSeek](https://platform.deepseek.com) — AI API（充值10元即可）

### 2. 创建 Supabase 项目
1. 新建项目，记下 `Project URL` 和 `anon public key`
2. 进入 SQL Editor
3. 依次执行 `supabase/migrations/` 目录下的三个SQL文件
4. Authentication → Providers → Email → 启用

### 3. 部署到 Vercel
1. 将代码推送到 GitHub
2. 在 Vercel 导入仓库
3. 设置环境变量：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`DEEPSEEK_API_KEY`
4. 部署

### 4. 使用
1. 访问域名 → 输入邮箱 → 点击魔法链接登录
2. 手机浏览器打开 → 添加到桌面 → 像 App 一样使用

## 月费用

| 项目 | 费用 |
|------|------|
| Vercel | 免费 |
| Supabase | 免费 |
| DeepSeek API | ~3-10元 |
| **合计** | **~5元/月** |
