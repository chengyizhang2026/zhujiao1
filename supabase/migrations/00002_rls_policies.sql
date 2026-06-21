-- ============================================================
-- Row Level Security 策略
-- ============================================================

-- 启用所有表的 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.next_week_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles: 用户只能读写自己的
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subject settings: 用户读写自己的
CREATE POLICY "Users can manage own subject settings"
  ON public.subject_settings FOR ALL
  USING (auth.uid() = profile_id);

-- 教材数据: 所有认证用户可读
CREATE POLICY "Auth users can read chapters"
  ON public.chapters FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can read knowledge points"
  ON public.knowledge_points FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can read prerequisites"
  ON public.knowledge_prerequisites FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can read mind maps"
  ON public.mind_maps FOR SELECT
  USING (auth.role() = 'authenticated');

-- Questions: 所有认证用户可读
CREATE POLICY "Auth users can read questions"
  ON public.questions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Exercises: 用户读写自己的
CREATE POLICY "Users can manage own exercises"
  ON public.exercises FOR ALL
  USING (auth.uid() = profile_id);

-- Mistakes: 用户读写自己的
CREATE POLICY "Users can manage own mistakes"
  ON public.mistakes FOR ALL
  USING (auth.uid() = profile_id);

-- Review schedules: 用户读写自己的
CREATE POLICY "Users can manage own review schedules"
  ON public.review_schedules FOR ALL
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage own review logs"
  ON public.review_logs FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.review_schedules WHERE id = schedule_id AND profile_id = auth.uid()
  ));

-- Vocabulary + reading + listening: 所有认证用户可读
CREATE POLICY "Auth users can read vocabulary"
  ON public.vocabulary FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can read reading passages"
  ON public.reading_passages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can read listening exercises"
  ON public.listening_exercises FOR SELECT
  USING (auth.role() = 'authenticated');

-- Vocab reviews: 用户读写自己的
CREATE POLICY "Users can manage own vocab reviews"
  ON public.vocab_reviews FOR ALL
  USING (auth.uid() = profile_id);

-- Writing: 用户读写自己的
CREATE POLICY "Users can manage own writing"
  ON public.writing_exercises FOR ALL
  USING (auth.uid() = profile_id);

-- Learning sessions: 用户读写自己的
CREATE POLICY "Users can manage own sessions"
  ON public.learning_sessions FOR ALL
  USING (auth.uid() = profile_id);

-- Learning logs: 用户读写自己的
CREATE POLICY "Users can manage own logs"
  ON public.learning_logs FOR ALL
  USING (auth.uid() = profile_id);

-- Weekly reports: 用户读写自己的
CREATE POLICY "Users can manage own reports"
  ON public.weekly_reports FOR ALL
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can manage own next week plans"
  ON public.next_week_plans FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.weekly_reports WHERE id = weekly_report_id AND profile_id = auth.uid()
  ));

-- API usage: 仅 service_role 可读写
CREATE POLICY "Service role can manage api usage"
  ON public.api_usage FOR ALL
  USING (auth.role() = 'service_role');
