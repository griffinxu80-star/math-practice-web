-- Fix: drop and recreate tables with user_id instead of student_id
-- exam_attempts
DROP TABLE IF EXISTS exam_attempts;
CREATE TABLE exam_attempts (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT,
  answers TEXT NOT NULL DEFAULT '{}',
  score REAL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','submitted','graded')),
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- wrong_questions
DROP TABLE IF EXISTS wrong_questions;
CREATE TABLE wrong_questions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  exam_attempt_id TEXT,
  wrong_answer TEXT,
  correct_answer TEXT NOT NULL,
  knowledge_point_id TEXT NOT NULL,
  attempted_at TEXT NOT NULL DEFAULT (datetime('now')),
  mastered INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

-- weekly_reports
DROP TABLE IF EXISTS weekly_reports;
CREATE TABLE weekly_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  exam_count INTEGER DEFAULT 0,
  avg_score REAL DEFAULT 0,
  improvement_points INTEGER DEFAULT 0,
  wrong_question_count INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- point_transactions
DROP TABLE IF EXISTS point_transactions;
CREATE TABLE point_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('earn','spend')),
  source TEXT NOT NULL,
  source_id TEXT,
  balance_after INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- achievements
DROP TABLE IF EXISTS achievements;
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  achievement_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(achievement_id, user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- point_redemptions
DROP TABLE IF EXISTS point_redemptions;
CREATE TABLE point_redemptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','redeemed','cancelled')),
  redeemed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES point_shop_items(id)
);

-- learning_goals - use user_id for parent
DROP TABLE IF EXISTS learning_goals;
CREATE TABLE learning_goals (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  description TEXT NOT NULL,
  target_score REAL,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','expired')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES users(id)
);

-- parent_child_bindings - use user_id
DROP TABLE IF EXISTS parent_child_bindings;
CREATE TABLE parent_child_bindings (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  bound_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (parent_id) REFERENCES users(id),
  FOREIGN KEY (child_id) REFERENCES users(id)
);

-- knowledge_mastery - use user_id
DROP TABLE IF EXISTS knowledge_mastery;
CREATE TABLE knowledge_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  knowledge_point_id TEXT NOT NULL,
  alpha REAL NOT NULL DEFAULT 1,
  beta REAL NOT NULL DEFAULT 1,
  last_attempt TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, knowledge_point_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_user ON wrong_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_user ON weekly_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_point_redemptions_user ON point_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_bindings_parent ON parent_child_bindings(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_bindings_child ON parent_child_bindings(child_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_mastery_user ON knowledge_mastery(user_id);