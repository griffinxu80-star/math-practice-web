# Supabase 数据库初始化指南

## 步骤 1：创建 Supabase 项目

1. 访问 https://supabase.com
2. 登录或注册账号
3. 点击 **"New Project"**
4. 填写项目信息：
   - **Name**: 小学数学自测辅导 (或你喜欢的名称)
   - **Database Password**: 设置一个强密码（保存好！）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或 `Japan`
   - **Pricing Plan**: 选择 **Free**
5. 点击 **"Create new project"**
6. 等待 2-3 分钟项目创建完成

## 步骤 2：获取数据库连接字符串

1. 进入项目 Dashboard
2. 左侧菜单选择 **Settings** → **Database**
3. 找到 **"Connection string"** 部分
4. 选择 **"URI"** 标签
5. 复制连接字符串，格式如：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## 步骤 3：执行初始化 SQL

1. 左侧菜单选择 **SQL Editor**
2. 点击 **"New Query"**
3. 复制下方 SQL 内容并执行

### 完整初始化 SQL

```sql
-- 创建数据库表
-- 用户名+密码登录方式，移除手机号字段

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
  children_ids TEXT DEFAULT '\''[]'\'' ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS knowledge_points (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK(grade >= 4 AND grade <= 6),
  subject TEXT NOT NULL DEFAULT '\''math'\'',
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
  question_type TEXT NOT NULL CHECK(question_type IN ('\''choice'\'','\''fill_blank'\'','\''calculation'\'','\''geometry'\'')),
  options TEXT,
  correct_answer TEXT NOT NULL,
  difficulty REAL NOT NULL DEFAULT 0.5,
  source_type TEXT NOT NULL DEFAULT '\''original'\'' CHECK(source_type IN ('\''original'\'','\''adapted'\'')),
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
  user_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  answers TEXT NOT NULL DEFAULT '\''{}'\'',
  score REAL,
  status TEXT NOT NULL DEFAULT '\''in_progress'\'' CHECK(status IN ('\''in_progress'\'','\''submitted'\'','\''graded'\'')),
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS knowledge_mastery (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  knowledge_point_id TEXT NOT NULL,
  alpha REAL NOT NULL DEFAULT 1,
  beta REAL NOT NULL DEFAULT 1,
  last_attempt TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, knowledge_point_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

CREATE TABLE IF NOT EXISTS wrong_questions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  exam_attempt_id TEXT,
  wrong_answer TEXT,
  correct_answer TEXT NOT NULL,
  knowledge_point_id TEXT NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mastered INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (knowledge_point_id) REFERENCES knowledge_points(id)
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('\''earn'\'','\''spend'\'')),
  source TEXT NOT NULL,
  source_id TEXT,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  achievement_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(achievement_id, user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
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
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_cost INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT '\''pending'\'' CHECK(status IN ('\''pending'\'','\''redeemed'\'','\''cancelled'\'')),
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES point_shop_items(id)
);

CREATE TABLE IF NOT EXISTS parent_child_bindings (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  bound_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES users(id),
  FOREIGN KEY (child_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS weekly_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  exam_count INTEGER DEFAULT 0,
  avg_score REAL DEFAULT 0,
  improvement_points INTEGER DEFAULT 0,
  wrong_question_count INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS learning_goals (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  parent_id TEXT NOT NULL,
  description TEXT NOT NULL,
  target_score REAL,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT '\''active'\'' CHECK(status IN ('\''active'\'','\''completed'\'','\''expired'\'')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_mastery_user ON knowledge_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_wrong_questions_user ON wrong_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_bindings_parent ON parent_child_bindings(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_bindings_child ON parent_child_bindings(child_id);
CREATE INDEX IF NOT EXISTS idx_questions_knowledge ON questions(knowledge_point_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_grade ON knowledge_points(grade);
```

4. 点击 **"Run"** 执行
5. 看到 **"Success. No rows returned"** 表示成功

## 步骤 4：验证表创建成功

在 SQL Editor 中执行：

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = '\''public'\'' ORDER BY table_name;
```

应该看到以下表：
- users
- student_profiles
- parent_profiles
- knowledge_points
- questions
- exams
- exam_attempts
- knowledge_mastery
- wrong_questions
- point_transactions
- achievements
- point_shop_items
- point_redemptions
- parent_child_bindings
- weekly_reports
- learning_goals

## 步骤 5：导入种子数据

### 方法 A：使用管理工具（推荐）

1. 左侧菜单选择 **Table Editor**
2. 依次进入每个表，手动或批量导入数据

### 方法 B：使用 SQL 批量插入

在 SQL Editor 中执行以下脚本导入知识点：

```sql
-- 四年级知识点 (43 个)
INSERT INTO knowledge_points (id, name, grade, chapter, unit) VALUES
('kp_4__0', '亿以内数的认识', 4, '大数的认识', 1),
('kp_4__1', '数位顺序表', 4, '大数的认识', 1),
('kp_4__2', '读亿以内的数', 4, '大数的认识', 1),
-- ... 继续添加所有知识点
('kp_4__42', '小数加减混合运算', 4, '小数的加法和减法', 1);

-- 五年级知识点 (39 个)
INSERT INTO knowledge_points (id, name, grade, chapter, unit) VALUES
('kp_5__0', '小数乘法', 5, '小数乘法', 1),
-- ... 继续添加所有知识点
('kp_5__38', '找次品', 5, '数学广角', 1);

-- 六年级知识点 (42 个)
INSERT INTO knowledge_points (id, name, grade, chapter, unit) VALUES
('kp_6__0', '分数乘法', 6, '分数乘法', 1),
-- ... 继续添加所有知识点
('kp_6__41', '统计与概率', 6, '总复习', 1);
```

**完整知识点列表在 `workspace/web/server/database/seed/knowledge.js` 文件中**

## 常见问题

### Q: 连接字符串中的密码在哪里？
A: 在 Supabase Dashboard → Settings → Database 中，找到 **"Database password"** 部分。

### Q: 免费套餐有什么限制？
A: 免费套餐：
- 500MB 数据库存储
- 50GB 流量/月
- 足够个人使用和测试

### Q: 如何备份数据？
A: Supabase 自动每天备份，可在 Dashboard → Settings → Backup 中查看。

### Q: 如何重置数据库？
A: 在 SQL Editor 中执行 `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`，然后重新执行初始化 SQL。
