-- ============================================================
-- 助教智能体 — 完整数据库结构（可重复执行，不会报错）
-- ============================================================

-- 0. 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. 用户与设置
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('parent', 'student')),
  display_name  TEXT NOT NULL,
  grade         TEXT NOT NULL DEFAULT '七年级上',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 自动为每个新用户创建 profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (NEW.id, 'student', COALESCE(NEW.email, '同学'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.subject_settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  textbook_name TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, subject)
);

-- ============================================================
-- 2. 教材知识结构
-- ============================================================

CREATE TABLE IF NOT EXISTS public.chapters (
  id            TEXT PRIMARY KEY,
  subject       TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  textbook      TEXT NOT NULL,
  chapter_no    INTEGER NOT NULL,
  title         TEXT NOT NULL,
  sort_order    INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_points (
  id            TEXT PRIMARY KEY,
  chapter_id    TEXT NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  title         TEXT NOT NULL,
  description   TEXT,
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  sort_order    INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.knowledge_prerequisites (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_point_id  TEXT NOT NULL REFERENCES public.knowledge_points(id) ON DELETE CASCADE,
  prerequisite_id     TEXT NOT NULL REFERENCES public.knowledge_points(id) ON DELETE CASCADE,
  UNIQUE(knowledge_point_id, prerequisite_id),
  CHECK(knowledge_point_id <> prerequisite_id)
);

CREATE TABLE IF NOT EXISTS public.mind_maps (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id    UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE UNIQUE,
  mermaid_syntax TEXT NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. 练习与错题
-- ============================================================

CREATE TABLE IF NOT EXISTS public.questions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_point_id UUID NOT NULL REFERENCES public.knowledge_points(id) ON DELETE CASCADE,
  difficulty      TEXT NOT NULL CHECK (difficulty IN ('basic', 'consolidation', 'advanced')),
  question_type   TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice', 'fill_blank', 'short_answer', 'calculation',
    'true_false', 'error_correction', 'translation', 'dictation', 'reading_comprehension'
  )),
  question_text   TEXT NOT NULL,
  options         JSONB,
  correct_answer  TEXT NOT NULL,
  answer_explanation TEXT,
  hints           JSONB,
  metadata        JSONB,
  created_by      TEXT NOT NULL DEFAULT 'ai',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  session_id      UUID,
  student_answer  TEXT,
  is_correct      BOOLEAN,
  time_spent_seconds INTEGER,
  hints_used      INTEGER NOT NULL DEFAULT 0,
  attempt_number  INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mistakes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id     UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  knowledge_point_id UUID NOT NULL REFERENCES public.knowledge_points(id),
  mistake_type    TEXT NOT NULL CHECK (mistake_type IN ('knowledge', 'habit', 'thinking')),
  ai_analysis     TEXT,
  avoidance_tip   TEXT,
  source          TEXT NOT NULL CHECK (source IN ('system', 'photo_upload')),
  photo_url       TEXT,
  is_remediated   BOOLEAN NOT NULL DEFAULT false,
  remediated_at   TIMESTAMPTZ,
  similar_question_id UUID REFERENCES public.questions(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. 间隔复习
-- ============================================================

CREATE TABLE IF NOT EXISTS public.review_schedules (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type       TEXT NOT NULL CHECK (item_type IN ('knowledge_point', 'mistake', 'vocabulary')),
  item_id         UUID NOT NULL,
  fsrs_state      JSONB NOT NULL DEFAULT '{"stability": 0, "difficulty": 0, "state": 0}',
  next_review_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_review_at  TIMESTAMPTZ,
  consecutive_correct INTEGER NOT NULL DEFAULT 0,
  is_mastered     BOOLEAN NOT NULL DEFAULT false,
  mastered_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS public.review_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id     UUID NOT NULL REFERENCES public.review_schedules(id) ON DELETE CASCADE,
  quality         INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  rating_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  time_spent_seconds INTEGER
);

-- ============================================================
-- 5. 英语专项
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vocabulary (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id      UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  word            TEXT NOT NULL,
  part_of_speech  TEXT,
  chinese_meaning TEXT NOT NULL,
  phonetic        TEXT,
  example_sentence TEXT,
  difficulty      TEXT NOT NULL DEFAULT 'basic',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vocab_reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_id   UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  review_direction TEXT NOT NULL CHECK (review_direction IN ('en_to_cn', 'cn_to_en')),
  fsrs_state      JSONB NOT NULL DEFAULT '{"stability": 0, "difficulty": 0, "state": 0}',
  next_review_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_review_at  TIMESTAMPTZ,
  consecutive_correct INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, vocabulary_id, review_direction)
);

CREATE TABLE IF NOT EXISTS public.reading_passages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id      UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  passage_text    TEXT NOT NULL,
  difficulty      TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  word_count      INTEGER NOT NULL,
  questions       JSONB NOT NULL,
  difficult_sentences JSONB,
  created_by      TEXT NOT NULL DEFAULT 'ai',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.listening_exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id      UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  transcript      TEXT NOT NULL,
  exercise_type   TEXT NOT NULL CHECK (exercise_type IN ('dictation', 'keyword_fill', 'comprehension')),
  audio_generated BOOLEAN NOT NULL DEFAULT false,
  questions       JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.writing_exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic           TEXT NOT NULL,
  student_text    TEXT,
  ai_correction   JSONB,
  submitted_at    TIMESTAMPTZ,
  corrected_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. 学习会话与报表
-- ============================================================

CREATE TABLE IF NOT EXISTS public.learning_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject         TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  session_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  phase           TEXT NOT NULL CHECK (phase IN ('diagnose', 'learn', 'practice', 'assess', 'remediate')),
  knowledge_point_id UUID REFERENCES public.knowledge_points(id),
  is_completed    BOOLEAN NOT NULL DEFAULT false,
  questions_total    INTEGER NOT NULL DEFAULT 0,
  questions_correct  INTEGER NOT NULL DEFAULT 0,
  total_time_seconds INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.learning_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  subject         TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  activity_type   TEXT NOT NULL CHECK (activity_type IN (
    'session_start', 'knowledge_learned', 'question_answered',
    'mistake_recorded', 'review_completed', 'vocab_practiced',
    'reading_completed', 'listening_completed', 'writing_submitted'
  )),
  detail          JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.weekly_reports (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start      DATE NOT NULL,
  week_end        DATE NOT NULL,
  report_data     JSONB NOT NULL,
  radar_data      JSONB NOT NULL,
  weak_points     JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, week_start)
);

CREATE TABLE IF NOT EXISTS public.next_week_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_report_id UUID NOT NULL REFERENCES public.weekly_reports(id) ON DELETE CASCADE UNIQUE,
  plan_data       JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_usage (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint        TEXT NOT NULL,
  model           TEXT NOT NULL,
  prompt_tokens   INTEGER NOT NULL,
  completion_tokens INTEGER NOT NULL,
  estimated_cost_rmb NUMERIC(10, 6),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 索引
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_chapters_subject ON public.chapters(subject);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_chapter ON public.knowledge_points(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_kp ON public.questions(knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_profile ON public.exercises(profile_id);
CREATE INDEX IF NOT EXISTS idx_exercises_session ON public.exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_profile ON public.mistakes(profile_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_type ON public.mistakes(mistake_type);
CREATE INDEX IF NOT EXISTS idx_review_schedules_profile ON public.review_schedules(profile_id);
CREATE INDEX IF NOT EXISTS idx_review_schedules_next ON public.review_schedules(next_review_at);
CREATE INDEX IF NOT EXISTS idx_vocabulary_chapter ON public.vocabulary(chapter_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_profile ON public.learning_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_date ON public.learning_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_learning_logs_date ON public.learning_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_learning_logs_profile ON public.learning_logs(profile_id);

-- ============================================================
-- RLS 安全策略（先删后建，避免冲突）
-- ============================================================

ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subject_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.knowledge_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.knowledge_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.review_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vocab_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.listening_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.writing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.learning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.next_week_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_usage ENABLE ROW LEVEL SECURITY;

-- 删除所有旧策略
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END;
$$;

-- 创建新策略
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage own subject settings"
  ON public.subject_settings FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Auth read chapters" ON public.chapters FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read knowledge points" ON public.knowledge_points FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read prerequisites" ON public.knowledge_prerequisites FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read mind maps" ON public.mind_maps FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read questions" ON public.questions FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users manage own exercises" ON public.exercises FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own mistakes" ON public.mistakes FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own review schedules" ON public.review_schedules FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users manage own review logs" ON public.review_logs FOR ALL
  USING (EXISTS (SELECT 1 FROM public.review_schedules WHERE id = schedule_id AND profile_id = auth.uid()));

CREATE POLICY "Auth read vocabulary" ON public.vocabulary FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read reading passages" ON public.reading_passages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read listening exercises" ON public.listening_exercises FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users manage own vocab reviews" ON public.vocab_reviews FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own writing" ON public.writing_exercises FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own sessions" ON public.learning_sessions FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own logs" ON public.learning_logs FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own reports" ON public.weekly_reports FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Users manage own next week plans" ON public.next_week_plans FOR ALL
  USING (EXISTS (SELECT 1 FROM public.weekly_reports WHERE id = weekly_report_id AND profile_id = auth.uid()));
CREATE POLICY "Service manage api usage" ON public.api_usage FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- 种子数据（可重复执行）
-- ============================================================

DELETE FROM public.knowledge_prerequisites;
DELETE FROM public.knowledge_points;
DELETE FROM public.chapters;

-- 数学章节
INSERT INTO public.chapters (id, subject, textbook, chapter_no, title, sort_order) VALUES
('math-01', 'math', '北师大版七年级上册', 1, '第一章 丰富的图形世界', 1),
('math-02', 'math', '北师大版七年级上册', 2, '第二章 有理数及其运算', 2),
('math-03', 'math', '北师大版七年级上册', 3, '第三章 整式及其加减', 3),
('math-04', 'math', '北师大版七年级上册', 4, '第四章 基本平面图形', 4),
('math-05', 'math', '北师大版七年级上册', 5, '第五章 一元一次方程', 5),
('math-06', 'math', '北师大版七年级上册', 6, '第六章 数据的收集与整理', 6);

-- 数学知识点
INSERT INTO public.knowledge_points (id, chapter_id, subject, title, difficulty, sort_order) VALUES
('kp-m1', 'math-01', 'math', '生活中的立体图形', 'basic', 1),
('kp-m2', 'math-01', 'math', '展开与折叠', 'basic', 2),
('kp-m3', 'math-01', 'math', '截一个几何体', 'intermediate', 3),
('kp-m4', 'math-01', 'math', '从三个方向看物体的形状', 'intermediate', 4),
('kp-m5', 'math-02', 'math', '正数和负数', 'basic', 5),
('kp-m6', 'math-02', 'math', '数轴', 'basic', 6),
('kp-m7', 'math-02', 'math', '相反数', 'basic', 7),
('kp-m8', 'math-02', 'math', '绝对值', 'basic', 8),
('kp-m9', 'math-02', 'math', '有理数的加法', 'basic', 9),
('kp-m10', 'math-02', 'math', '有理数的减法', 'basic', 10),
('kp-m11', 'math-02', 'math', '有理数的加减混合运算', 'intermediate', 11),
('kp-m12', 'math-02', 'math', '有理数的乘法', 'basic', 12),
('kp-m13', 'math-02', 'math', '有理数的除法', 'basic', 13),
('kp-m14', 'math-02', 'math', '有理数的乘方', 'intermediate', 14),
('kp-m15', 'math-02', 'math', '科学记数法', 'basic', 15),
('kp-m16', 'math-02', 'math', '有理数的混合运算', 'advanced', 16),
('kp-m17', 'math-03', 'math', '用字母表示数', 'basic', 17),
('kp-m18', 'math-03', 'math', '代数式', 'basic', 18),
('kp-m19', 'math-03', 'math', '整式', 'basic', 19),
('kp-m20', 'math-03', 'math', '合并同类项', 'intermediate', 20),
('kp-m21', 'math-03', 'math', '去括号', 'intermediate', 21),
('kp-m22', 'math-03', 'math', '整式的加减', 'intermediate', 22),
('kp-m23', 'math-03', 'math', '探索规律', 'advanced', 23),
('kp-m24', 'math-04', 'math', '线段、射线、直线', 'basic', 24),
('kp-m25', 'math-04', 'math', '比较线段的长短', 'intermediate', 25),
('kp-m26', 'math-04', 'math', '角', 'basic', 26),
('kp-m27', 'math-04', 'math', '角的比较', 'intermediate', 27),
('kp-m28', 'math-04', 'math', '多边形和圆的初步认识', 'basic', 28),
('kp-m29', 'math-05', 'math', '认识一元一次方程', 'basic', 29),
('kp-m30', 'math-05', 'math', '求解一元一次方程', 'intermediate', 30),
('kp-m31', 'math-05', 'math', '一元一次方程应用——等积变形', 'intermediate', 31),
('kp-m32', 'math-05', 'math', '一元一次方程应用——销售问题', 'intermediate', 32),
('kp-m33', 'math-05', 'math', '一元一次方程应用——工程问题', 'intermediate', 33),
('kp-m34', 'math-05', 'math', '一元一次方程应用——行程问题', 'advanced', 34),
('kp-m35', 'math-06', 'math', '数据的收集', 'basic', 35),
('kp-m36', 'math-06', 'math', '普查和抽样调查', 'basic', 36),
('kp-m37', 'math-06', 'math', '数据的表示', 'intermediate', 37),
('kp-m38', 'math-06', 'math', '统计图的选择', 'intermediate', 38);

-- 数学前置依赖
INSERT INTO public.knowledge_prerequisites (knowledge_point_id, prerequisite_id) VALUES
('kp-m6', 'kp-m5'), ('kp-m7', 'kp-m5'), ('kp-m8', 'kp-m6'), ('kp-m9', 'kp-m5'),
('kp-m10', 'kp-m9'), ('kp-m11', 'kp-m10'), ('kp-m12', 'kp-m9'), ('kp-m13', 'kp-m12'),
('kp-m14', 'kp-m12'), ('kp-m16', 'kp-m14'), ('kp-m17', 'kp-m5'), ('kp-m18', 'kp-m17'),
('kp-m30', 'kp-m29'), ('kp-m31', 'kp-m30'), ('kp-m32', 'kp-m30'),
('kp-m33', 'kp-m30'), ('kp-m34', 'kp-m30');

-- 英语章节
INSERT INTO public.chapters (id, subject, textbook, chapter_no, title, sort_order) VALUES
('eng-m1', 'english', '外研版七年级上册', 1, 'Module 1 My classmates', 7),
('eng-m2', 'english', '外研版七年级上册', 2, 'Module 2 My family', 8),
('eng-m3', 'english', '外研版七年级上册', 3, 'Module 3 My school', 9),
('eng-m4', 'english', '外研版七年级上册', 4, 'Module 4 Healthy food', 10),
('eng-m5', 'english', '外研版七年级上册', 5, 'Module 5 My school day', 11),
('eng-m6', 'english', '外研版七年级上册', 6, 'Module 6 A trip to the zoo', 12),
('eng-m7', 'english', '外研版七年级上册', 7, 'Module 7 Computers', 13),
('eng-m8', 'english', '外研版七年级上册', 8, 'Module 8 Choosing presents', 14),
('eng-m9', 'english', '外研版七年级上册', 9, 'Module 9 People and places', 15),
('eng-m10', 'english', '外研版七年级上册', 10, 'Module 10 Spring Festival', 16);

-- 英语知识点
INSERT INTO public.knowledge_points (id, chapter_id, subject, title, difficulty, sort_order) VALUES
('kp-e1', 'eng-m1', 'english', 'be动词 am/is/are', 'basic', 39),
('kp-e2', 'eng-m1', 'english', '人称代词主格', 'basic', 40),
('kp-e3', 'eng-m2', 'english', '指示代词 this/that/these/those', 'basic', 41),
('kp-e4', 'eng-m2', 'english', '名词所有格', 'basic', 42),
('kp-e5', 'eng-m3', 'english', 'There be句型', 'basic', 43),
('kp-e6', 'eng-m3', 'english', '方位介词', 'basic', 44),
('kp-e7', 'eng-m4', 'english', 'have got的用法', 'basic', 45),
('kp-e8', 'eng-m4', 'english', '可数与不可数名词', 'basic', 46),
('kp-e9', 'eng-m4', 'english', 'some/any的用法', 'basic', 47),
('kp-e10', 'eng-m5', 'english', '一般现在时(I/we/you/they)', 'intermediate', 48),
('kp-e11', 'eng-m6', 'english', '一般现在时(第三人称单数)', 'intermediate', 49),
('kp-e12', 'eng-m7', 'english', '一般现在时疑问句', 'intermediate', 50),
('kp-e13', 'eng-m7', 'english', 'Wh-特殊疑问句', 'intermediate', 51),
('kp-e14', 'eng-m8', 'english', '频度副词', 'basic', 52),
('kp-e15', 'eng-m8', 'english', '一般现在时综合复习', 'intermediate', 53),
('kp-e16', 'eng-m9', 'english', '现在进行时(肯定句)', 'intermediate', 54),
('kp-e17', 'eng-m10', 'english', '现在进行时疑问句', 'intermediate', 55),
('kp-e18', 'eng-m10', 'english', '现在进行时与一般现在时对比', 'advanced', 56);

-- 验证
SELECT 'chapters' as tbl, count(*)::text FROM public.chapters
UNION ALL
SELECT 'knowledge_points', count(*)::text FROM public.knowledge_points
UNION ALL
SELECT 'knowledge_prerequisites', count(*)::text FROM public.knowledge_prerequisites;
