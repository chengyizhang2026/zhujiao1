-- ============================================================
-- 助教智能体 — 初始数据库结构
-- ============================================================

-- 0. 扩展设置
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. 用户与设置
-- ============================================================

CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('parent', 'student')),
  display_name  TEXT NOT NULL,
  grade         TEXT NOT NULL DEFAULT '七年级上',
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 自动为每个新用户创建 profile
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

-- 科目设置
CREATE TABLE public.subject_settings (
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

CREATE TABLE public.chapters (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject       TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  textbook      TEXT NOT NULL,
  chapter_no    INTEGER NOT NULL,
  title         TEXT NOT NULL,
  sort_order    INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.knowledge_points (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id    UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  title         TEXT NOT NULL,
  description   TEXT,
  difficulty    TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  sort_order    INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.knowledge_prerequisites (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_point_id  UUID NOT NULL REFERENCES public.knowledge_points(id) ON DELETE CASCADE,
  prerequisite_id     UUID NOT NULL REFERENCES public.knowledge_points(id) ON DELETE CASCADE,
  UNIQUE(knowledge_point_id, prerequisite_id),
  CHECK(knowledge_point_id <> prerequisite_id)
);

CREATE TABLE public.mind_maps (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id    UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE UNIQUE,
  mermaid_syntax TEXT NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. 练习与错题
-- ============================================================

CREATE TABLE public.questions (
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

CREATE TABLE public.exercises (
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

CREATE TABLE public.mistakes (
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
-- 4. 间隔复习（FSRS）
-- ============================================================

CREATE TABLE public.review_schedules (
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

CREATE TABLE public.review_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id     UUID NOT NULL REFERENCES public.review_schedules(id) ON DELETE CASCADE,
  quality         INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  rating_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  time_spent_seconds INTEGER
);

-- ============================================================
-- 5. 英语专项
-- ============================================================

CREATE TABLE public.vocabulary (
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

CREATE TABLE public.vocab_reviews (
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

CREATE TABLE public.reading_passages (
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

CREATE TABLE public.listening_exercises (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id      UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  transcript      TEXT NOT NULL,
  exercise_type   TEXT NOT NULL CHECK (exercise_type IN ('dictation', 'keyword_fill', 'comprehension')),
  audio_generated BOOLEAN NOT NULL DEFAULT false,
  questions       JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.writing_exercises (
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

CREATE TABLE public.learning_sessions (
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

CREATE TABLE public.learning_logs (
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

CREATE TABLE public.weekly_reports (
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

CREATE TABLE public.next_week_plans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekly_report_id UUID NOT NULL REFERENCES public.weekly_reports(id) ON DELETE CASCADE UNIQUE,
  plan_data       JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. API 使用追踪
-- ============================================================

CREATE TABLE public.api_usage (
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

CREATE INDEX idx_chapters_subject ON public.chapters(subject);
CREATE INDEX idx_knowledge_points_chapter ON public.knowledge_points(chapter_id);
CREATE INDEX idx_questions_kp ON public.questions(knowledge_point_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX idx_exercises_profile ON public.exercises(profile_id);
CREATE INDEX idx_exercises_session ON public.exercises(session_id);
CREATE INDEX idx_mistakes_profile ON public.mistakes(profile_id);
CREATE INDEX idx_mistakes_type ON public.mistakes(mistake_type);
CREATE INDEX idx_review_schedules_profile ON public.review_schedules(profile_id);
CREATE INDEX idx_review_schedules_next ON public.review_schedules(next_review_at);
CREATE INDEX idx_vocabulary_chapter ON public.vocabulary(chapter_id);
CREATE INDEX idx_learning_sessions_profile ON public.learning_sessions(profile_id);
CREATE INDEX idx_learning_sessions_date ON public.learning_sessions(session_date);
CREATE INDEX idx_learning_logs_date ON public.learning_logs(log_date);
CREATE INDEX idx_learning_logs_profile ON public.learning_logs(profile_id);
