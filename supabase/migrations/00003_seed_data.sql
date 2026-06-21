-- ============================================================
-- 种子数据 — 北师大版数学七年级上册 + 外研版英语七年级上册
-- ============================================================

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
-- 第一章
('kp-m1', 'math-01', 'math', '生活中的立体图形', 'basic', 1),
('kp-m2', 'math-01', 'math', '展开与折叠', 'basic', 2),
('kp-m3', 'math-01', 'math', '截一个几何体', 'intermediate', 3),
('kp-m4', 'math-01', 'math', '从三个方向看物体的形状', 'intermediate', 4),
-- 第二章
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
-- 第三章
('kp-m17', 'math-03', 'math', '用字母表示数', 'basic', 17),
('kp-m18', 'math-03', 'math', '代数式', 'basic', 18),
('kp-m19', 'math-03', 'math', '整式', 'basic', 19),
('kp-m20', 'math-03', 'math', '合并同类项', 'intermediate', 20),
('kp-m21', 'math-03', 'math', '去括号', 'intermediate', 21),
('kp-m22', 'math-03', 'math', '整式的加减', 'intermediate', 22),
('kp-m23', 'math-03', 'math', '探索规律', 'advanced', 23),
-- 第四章
('kp-m24', 'math-04', 'math', '线段、射线、直线', 'basic', 24),
('kp-m25', 'math-04', 'math', '比较线段的长短', 'intermediate', 25),
('kp-m26', 'math-04', 'math', '角', 'basic', 26),
('kp-m27', 'math-04', 'math', '角的比较', 'intermediate', 27),
('kp-m28', 'math-04', 'math', '多边形和圆的初步认识', 'basic', 28),
-- 第五章
('kp-m29', 'math-05', 'math', '认识一元一次方程', 'basic', 29),
('kp-m30', 'math-05', 'math', '求解一元一次方程', 'intermediate', 30),
('kp-m31', 'math-05', 'math', '一元一次方程应用——等积变形', 'intermediate', 31),
('kp-m32', 'math-05', 'math', '一元一次方程应用——销售问题', 'intermediate', 32),
('kp-m33', 'math-05', 'math', '一元一次方程应用——工程问题', 'intermediate', 33),
('kp-m34', 'math-05', 'math', '一元一次方程应用——行程问题', 'advanced', 34),
-- 第六章
('kp-m35', 'math-06', 'math', '数据的收集', 'basic', 35),
('kp-m36', 'math-06', 'math', '普查和抽样调查', 'basic', 36),
('kp-m37', 'math-06', 'math', '数据的表示', 'intermediate', 37),
('kp-m38', 'math-06', 'math', '统计图的选择', 'intermediate', 38);

-- 数学知识点前置依赖
INSERT INTO public.knowledge_prerequisites (knowledge_point_id, prerequisite_id) VALUES
('kp-m6', 'kp-m5'),   -- 数轴 需要 正数和负数
('kp-m7', 'kp-m5'),   -- 相反数 需要 正数和负数
('kp-m8', 'kp-m6'),   -- 绝对值 需要 数轴
('kp-m9', 'kp-m5'),   -- 有理数加法 需要 正数和负数
('kp-m10', 'kp-m9'),  -- 有理数减法 需要 有理数加法
('kp-m11', 'kp-m10'), -- 加减混合运算 需要 减法
('kp-m12', 'kp-m9'),  -- 乘法 需要 加法
('kp-m13', 'kp-m12'), -- 除法 需要 乘法
('kp-m14', 'kp-m12'), -- 乘方 需要 乘法
('kp-m16', 'kp-m14'), -- 混合运算 需要 乘方
('kp-m17', 'kp-m5'),  -- 用字母表示数 需要 正数和负数
('kp-m18', 'kp-m17'), -- 代数式 需要 用字母表示数
('kp-m30', 'kp-m29'), -- 求解一元一次方程 需要 认识方程
('kp-m31', 'kp-m30'), -- 方程应用 需要 求解
('kp-m32', 'kp-m30'),
('kp-m33', 'kp-m30'),
('kp-m34', 'kp-m30');

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

-- 英语知识点（每个模块的核心语法和词汇主题）
INSERT INTO public.knowledge_points (id, chapter_id, subject, title, difficulty, sort_order) VALUES
-- Module 1
('kp-e1', 'eng-m1', 'english', 'be动词 am/is/are', 'basic', 39),
('kp-e2', 'eng-m1', 'english', '人称代词主格', 'basic', 40),
-- Module 2
('kp-e3', 'eng-m2', 'english', '指示代词 this/that/these/those', 'basic', 41),
('kp-e4', 'eng-m2', 'english', '名词所有格', 'basic', 42),
-- Module 3
('kp-e5', 'eng-m3', 'english', 'There be句型', 'basic', 43),
('kp-e6', 'eng-m3', 'english', '方位介词', 'basic', 44),
-- Module 4
('kp-e7', 'eng-m4', 'english', 'have got的用法', 'basic', 45),
('kp-e8', 'eng-m4', 'english', '可数与不可数名词', 'basic', 46),
('kp-e9', 'eng-m4', 'english', 'some/any的用法', 'basic', 47),
-- Module 5
('kp-e10', 'eng-m5', 'english', '一般现在时(I/we/you/they)', 'intermediate', 48),
-- Module 6
('kp-e11', 'eng-m6', 'english', '一般现在时(第三人称单数)', 'intermediate', 49),
-- Module 7
('kp-e12', 'eng-m7', 'english', '一般现在时疑问句', 'intermediate', 50),
('kp-e13', 'eng-m7', 'english', 'Wh-特殊疑问句', 'intermediate', 51),
-- Module 8
('kp-e14', 'eng-m8', 'english', '频度副词', 'basic', 52),
('kp-e15', 'eng-m8', 'english', '一般现在时综合复习', 'intermediate', 53),
-- Module 9
('kp-e16', 'eng-m9', 'english', '现在进行时(肯定句)', 'intermediate', 54),
-- Module 10
('kp-e17', 'eng-m10', 'english', '现在进行时疑问句', 'intermediate', 55),
('kp-e18', 'eng-m10', 'english', '现在进行时与一般现在时对比', 'advanced', 56);
