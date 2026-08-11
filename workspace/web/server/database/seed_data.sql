-- ========== 种子数据 ==========

-- 1. 测试学生账号 (test_student / test123)
INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at)
VALUES ('user_test_student', 'test_student', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student', 4, '测试学生', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- 2. 测试家长账号 (test_parent / test123)
INSERT INTO users (id, username, password_hash, role, grade, name, created_at, updated_at)
VALUES ('user_test_parent', 'test_parent', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'parent', NULL, '测试家长', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- 3. 学生档案
INSERT INTO student_profiles (id, user_id, grade, total_score, total_exam_count, current_points, created_at)
VALUES ('profile_test_student', 'user_test_student', 4, 0, 0, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. 知识点 (四年级)
INSERT INTO knowledge_points (id, name, grade, subject, chapter, unit, difficulty, created_at) VALUES
('kp_4_001', '亿以内数的认识', 4, 'math', '大数的认识', 1, 0.5, NOW()),
('kp_4_002', '数位顺序表', 4, 'math', '大数的认识', 1, 0.5, NOW()),
('kp_4_003', '读亿以内的数', 4, 'math', '大数的认识', 1, 0.5, NOW()),
('kp_4_004', '角的度量', 4, 'math', '角的度量', 1, 0.5, NOW()),
('kp_4_005', '平行与垂直', 4, 'math', '平行四边形和梯形', 1, 0.5, NOW()),
('kp_4_006', '口算乘法', 4, 'math', '三位数乘两位数', 1, 0.5, NOW()),
('kp_4_007', '笔算乘法', 4, 'math', '三位数乘两位数', 1, 0.5, NOW()),
('kp_4_008', '条形统计图', 4, 'math', '统计', 1, 0.5, NOW()),
('kp_4_009', '小数的意义', 4, 'math', '小数的意义和性质', 1, 0.5, NOW()),
('kp_4_010', '小数加减法', 4, 'math', '小数的加法和减法', 1, 0.5, NOW()),
('kp_4_011', '加法交换律', 4, 'math', '运算定律', 1, 0.5, NOW()),
('kp_4_012', '乘法交换律', 4, 'math', '运算定律', 1, 0.5, NOW()),
('kp_4_013', '乘法分配律', 4, 'math', '运算定律', 1, 0.5, NOW()),
('kp_4_014', '三角形', 4, 'math', '三角形', 1, 0.5, NOW()),
('kp_4_015', '三角形的内角和', 4, 'math', '三角形', 1, 0.5, NOW()),
('kp_4_016', '优化问题', 4, 'math', '数学广角', 1, 0.5, NOW()),
('kp_5_001', '小数乘法', 5, 'math', '小数乘法', 1, 0.5, NOW()),
('kp_5_002', '小数除法', 5, 'math', '小数除法', 1, 0.5, NOW()),
('kp_5_003', '解简易方程', 5, 'math', '简易方程', 1, 0.5, NOW()),
('kp_5_004', '平行四边形的面积', 5, 'math', '多边形的面积', 1, 0.5, NOW()),
('kp_5_005', '三角形的面积', 5, 'math', '多边形的面积', 1, 0.5, NOW()),
('kp_5_006', '异分母分数加减法', 5, 'math', '分数的加法和减法', 1, 0.5, NOW()),
('kp_5_007', '找次品', 5, 'math', '数学广角', 1, 0.5, NOW()),
('kp_6_001', '分数乘法', 6, 'math', '分数乘法', 1, 0.5, NOW()),
('kp_6_002', '分数除法', 6, 'math', '分数除法', 1, 0.5, NOW()),
('kp_6_003', '比的认识', 6, 'math', '比', 1, 0.5, NOW()),
('kp_6_004', '圆的周长', 6, 'math', '圆', 1, 0.5, NOW()),
('kp_6_005', '圆的面积', 6, 'math', '圆', 1, 0.5, NOW()),
('kp_6_006', '百分数的意义', 6, 'math', '百分数', 1, 0.5, NOW()),
('kp_6_007', '圆柱的表面积', 6, 'math', '圆柱与圆锥', 1, 0.5, NOW()),
('kp_6_008', '圆锥的体积', 6, 'math', '圆柱与圆锥', 1, 0.5, NOW()),
('kp_6_009', '比例尺', 6, 'math', '比例', 1, 0.5, NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. 示例题目 (关联到第一个知识点)
INSERT INTO questions (id, knowledge_point_id, content, question_type, options, correct_answer, difficulty, source_type, source_name, created_at) VALUES
('q_demo_001', 'kp_4_001', '356 + 478 = ?', 'calculation', NULL, '834', 0.3, 'original', '官方公开资源', NOW()),
('q_demo_002', 'kp_4_001', '下面哪个是质数？A. 4 B. 9 C. 7 D. 15', 'choice', '["A. 4","B. 9","C. 7","D. 15"]', 'C', 0.4, 'original', '官方公开资源', NOW()),
('q_demo_003', 'kp_4_001', '一个直角三角形的两个锐角之和是（）度。', 'fill_blank', NULL, '90', 0.5, 'original', '官方公开资源', NOW()),
('q_demo_004', 'kp_4_001', '把12个苹果平均分给3个小朋友，每人分（）个。', 'fill_blank', NULL, '4', 0.3, 'original', '官方公开资源', NOW()),
('q_demo_005', 'kp_4_001', '计算：25 × 4 = ?', 'calculation', NULL, '100', 0.2, 'original', '官方公开资源', NOW()),
('q_demo_006', 'kp_4_004', '一条射线长3厘米。（判断对错）', 'fill_blank', NULL, '错误', 0.3, 'original', '官方公开资源', NOW()),
('q_demo_007', 'kp_5_001', '0.5 × 0.4 = ?', 'calculation', NULL, '0.2', 0.4, 'original', '官方公开资源', NOW()),
('q_demo_008', 'kp_6_004', '一个圆的半径是3cm，周长是（）cm。（π取3.14）', 'fill_blank', NULL, '18.84', 0.6, 'original', '官方公开资源', NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. 积分商城物品
INSERT INTO point_shop_items (id, name, description, icon_url, cost, stock, is_virtual, created_at) VALUES
('shop_1', 'Xueba Badge', 'Virtual badge', '🏅', 50, -1, 1, NOW()),
('shop_2', 'Study Certificate', 'Learning cert', '📜', 100, -1, 1, NOW()),
('shop_3', 'Superhero Badge', 'Limited badge', '🦸', 200, -1, 1, NOW()),
('shop_4', 'Math Star Title', 'Exclusive title', '⭐', 150, -1, 1, NOW()),
('shop_5', 'Challenge Ticket', 'Hard challenge', '🎫', 30, -1, 1, NOW())
ON CONFLICT (id) DO NOTHING;