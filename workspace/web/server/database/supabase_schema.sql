-- Supabase/PostgreSQL schema for 小学数学自测辅导
-- Run this in Supabase SQL Editor after creating a project

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student', 'parent')),
  grade INTEGER CHECK(grade >= 4 AND grade <= 6),
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  grade INTEGER NOT NULL,
  school TEXT,
  class_name TEXT,
  total_score INTEGER DEFAULT 0,
  total_exam_count INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS parent_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  children_ids TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS knowledge_points (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK(grade >= 4 AND grade <= 6),
  subject TEXT NOT NULL DEFAULT 'math',
  parent_id TEXT,
  chapter TEXT,
  unit INTEGER,
  difficulty REAL DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES knowledge_points(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  knowledge_point_id TEXT NOT NULL,
  content TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK(question_type IN ('choice','fill_blank','calculation','geometry')),
  options TEXT,
  correct_answer TEXT NOT NULL,
  difficulty REAL NOT NULL DEFAULT 0.5,
  source_type TEXT NOT NULL DEFAULT 'original' CHECK(source_type IN ('original','adapted')),
  source_name TEXT,
  explanation TEXT,
  image_url TEXT,
  geogebra_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  grade INTEGER NOT NULL,
  chapter TEXT,
  unit INTEGER,
  question_ids TEXT NOT NULL,
  time_limit INTEGER,
  total_score INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  answers TEXT NOT NULL DEFAULT '{}',
  score REAL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','submitted','graded')),
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE IF NOT EXISTS knowledge_mastery (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  knowledge_point_id TEXT NOT NULL,
  alpha REAL NOT NULL DEFAULT 1,
  beta REAL NOT NULL DEFAULT 1,
  last_attempt TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, knowledge_point_id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

CREATE TABLE IF NOT EXISTS wrong_questions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  exam_attempt_id TEXT,
  wrong_answer TEXT,
  correct_answer TEXT NOT NULL,
  knowledge_point_id TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mastered INTEGER DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('earn','spend')),
  source TEXT NOT NULL,
  source_id TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  achievement_id TEXT NOT NULL,
  student_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(achievement_id, student_id),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE IF NOT EXISTS point_shop_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  cost INTEGER NOT NULL,
  stock INTEGER,
  is_virtual INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS point_redemptions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','redeemed','cancelled')),
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (item_id) REFERENCES point_shop_items(id)
);

CREATE TABLE IF NOT EXISTS parent_child_bindings (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  bound_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES student_profiles(id),
  FOREIGN KEY (child_id) REFERENCES student_profiles(id)
);

CREATE TABLE IF NOT EXISTS weekly_reports (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  exam_count INTEGER DEFAULT 0,
  avg_score REAL DEFAULT 0,
  improvement_points INTEGER DEFAULT 0,
  wrong_question_count INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id)
);

CREATE TABLE IF NOT EXISTS learning_goals (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  description TEXT NOT NULL,
  target_score REAL,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES student_profiles(id),
  FOREIGN KEY (parent_id) REFERENCES parent_profiles(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON exam_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_mastery_student ON knowledge_mastery(student_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_student ON wrong_questions(student_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_student ON point_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_bindings_parent ON parent_child_bindings(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_bindings_child ON parent_child_bindings(child_id);
CREATE INDEX IF NOT EXISTS idx_questions_knowledge ON questions(knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_grade ON knowledge_points(grade);
