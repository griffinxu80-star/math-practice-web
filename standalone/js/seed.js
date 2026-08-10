function seedData() {
  if (DB._getArr('knowledgePoints').length === 0) {
    const kps = [
      { id: 'kp4_1', name: '亿以内数的认识', grade: 4, chapter: '大数的认识', unit: 1 },
      { id: 'kp4_2', name: '数位顺序表', grade: 4, chapter: '大数的认识', unit: 1 },
      { id: 'kp4_3', name: '角的度量', grade: 4, chapter: '角的度量', unit: 1 },
      { id: 'kp4_4', name: '三位数乘两位数', grade: 4, chapter: '三位数乘两位数', unit: 1 },
      { id: 'kp4_5', name: '平行四边形和梯形', grade: 4, chapter: '平行四边形和梯形', unit: 1 },
      { id: 'kp4_6', name: '条形统计图', grade: 4, chapter: '统计', unit: 1 },
      { id: 'kp4_7', name: '运算定律', grade: 4, chapter: '运算定律', unit: 1 },
      { id: 'kp4_8', name: '小数的意义', grade: 4, chapter: '小数的意义和性质', unit: 1 },
      { id: 'kp5_1', name: '小数乘法', grade: 5, chapter: '小数乘法', unit: 1 },
      { id: 'kp5_2', name: '小数除法', grade: 5, chapter: '小数除法', unit: 1 },
      { id: 'kp5_3', name: '简易方程', grade: 5, chapter: '简易方程', unit: 1 },
      { id: 'kp5_4', name: '位置', grade: 5, chapter: '位置', unit: 1 },
      { id: 'kp5_5', name: '多边形的面积', grade: 5, chapter: '多边形的面积', unit: 1 },
      { id: 'kp5_6', name: '分数意义和性质', grade: 5, chapter: '分数意义和性质', unit: 1 },
      { id: 'kp5_7', name: '分数的加法和减法', grade: 5, chapter: '分数的加法和减法', unit: 1 },
      { id: 'kp6_1', name: '分数乘法', grade: 6, chapter: '分数乘法', unit: 1 },
      { id: 'kp6_2', name: '分数除法', grade: 6, chapter: '分数除法', unit: 1 },
      { id: 'kp6_3', name: '比', grade: 6, chapter: '比', unit: 1 },
      { id: 'kp6_4', name: '圆', grade: 6, chapter: '圆', unit: 1 },
      { id: 'kp6_5', name: '百分数', grade: 6, chapter: '百分数', unit: 1 },
      { id: 'kp6_6', name: '圆柱与圆锥', grade: 6, chapter: '圆柱与圆锥', unit: 1 },
      { id: 'kp6_7', name: '比例', grade: 6, chapter: '比例', unit: 1 },
      { id: 'kp6_8', name: '数学广角', grade: 6, chapter: '数学广角', unit: 1 },
    ];
    DB._setArr('knowledgePoints', kps);
  }
  if (DB._getArr('questions').length === 0) {
    const questions = [
      { id: 'q4_1', knowledgePointId: 'kp4_1', content: '356 + 478 = ?', type: 'calculation', correctAnswer: '834', difficulty: 0.3, grade: 4, chapter: '大数的认识' },
      { id: 'q4_2', knowledgePointId: 'kp4_1', content: '下面哪个是质数？A. 4 B. 9 C. 7 D. 15', type: 'choice', options: JSON.stringify(['A. 4', 'B. 9', 'C. 7', 'D. 15']), correctAnswer: 'C', difficulty: 0.4, grade: 4, chapter: '大数的认识' },
      { id: 'q4_3', knowledgePointId: 'kp4_1', content: '一个直角三角形的两个锐角之和是（）度。', type: 'fill_blank', correctAnswer: '90', difficulty: 0.5, grade: 4, chapter: '大数的认识' },
      { id: 'q4_4', knowledgePointId: 'kp4_1', content: '把12个苹果平均分给3个小朋友，每人分（）个。', type: 'fill_blank', correctAnswer: '4', difficulty: 0.3, grade: 4, chapter: '大数的认识' },
      { id: 'q4_5', knowledgePointId: 'kp4_4', content: '计算：25 × 4 = ?', type: 'calculation', correctAnswer: '100', difficulty: 0.2, grade: 4, chapter: '三位数乘两位数' },
      { id: 'q4_6', knowledgePointId: 'kp4_4', content: '下面哪个数最接近1000？A. 998 B. 1002 C. 995 D. 1005', type: 'choice', options: JSON.stringify(['A. 998', 'B. 1002', 'C. 995', 'D. 1005']), correctAnswer: 'A', difficulty: 0.5, grade: 4, chapter: '大数的认识' },
      { id: 'q4_7', knowledgePointId: 'kp4_3', content: '角是从（）引出的两条（）所组成的图形。', type: 'fill_blank', correctAnswer: '一点射线', difficulty: 0.4, grade: 4, chapter: '角的度量' },
      { id: 'q4_8', knowledgePointId: 'kp4_7', content: '加法交换律用字母表示是（）。', type: 'fill_blank', correctAnswer: 'a+b=b+a', difficulty: 0.3, grade: 4, chapter: '运算定律' },
      { id: 'q4_9', knowledgePointId: 'kp4_8', content: '0.5 里面有（）个0.1。', type: 'fill_blank', correctAnswer: '5', difficulty: 0.3, grade: 4, chapter: '小数的意义' },
      { id: 'q4_10', knowledgePointId: 'kp4_5', content: '平行四边形的（）相等。', type: 'fill_blank', correctAnswer: '对边', difficulty: 0.4, grade: 4, chapter: '平行四边形和梯形' },
      { id: 'q5_1', knowledgePointId: 'kp5_1', content: '0.5 × 0.4 = ?', type: 'calculation', correctAnswer: '0.2', difficulty: 0.4, grade: 5, chapter: '小数乘法' },
      { id: 'q5_2', knowledgePointId: 'kp5_1', content: '一个平行四边形的底是8cm，高是5cm，面积是（）平方厘米。', type: 'fill_blank', correctAnswer: '40', difficulty: 0.5, grade: 5, chapter: '小数乘法' },
      { id: 'q5_3', knowledgePointId: 'kp5_3', content: '解方程：x + 5 = 12，x = ?', type: 'calculation', correctAnswer: '7', difficulty: 0.4, grade: 5, chapter: '简易方程' },
      { id: 'q5_4', knowledgePointId: 'kp5_2', content: '3.6 ÷ 0.9 = ?', type: 'calculation', correctAnswer: '4', difficulty: 0.5, grade: 5, chapter: '小数除法' },
      { id: 'q5_5', knowledgePointId: 'kp5_5', content: '一个三角形的底是6cm，高是4cm，面积是（）平方厘米。', type: 'fill_blank', correctAnswer: '12', difficulty: 0.5, grade: 5, chapter: '多边形的面积' },
      { id: 'q5_6', knowledgePointId: 'kp5_6', content: '3/4 = （）/8', type: 'fill_blank', correctAnswer: '6', difficulty: 0.5, grade: 5, chapter: '分数意义和性质' },
      { id: 'q5_7', knowledgePointId: 'kp5_7', content: '1/2 + 1/3 = ?', type: 'calculation', correctAnswer: '5/6', difficulty: 0.6, grade: 5, chapter: '分数的加法和减法' },
      { id: 'q5_8', knowledgePointId: 'kp5_7', content: '下面哪个是正确的约分？A. 4/6=2/3 B. 4/6=1/2 C. 4/6=3/2', type: 'choice', options: JSON.stringify(['A. 4/6=2/3', 'B. 4/6=1/2', 'C. 4/6=3/2']), correctAnswer: 'A', difficulty: 0.4, grade: 5, chapter: '分数意义和性质' },
      { id: 'q6_1', knowledgePointId: 'kp6_1', content: '2/3 × 3/4 = ?', type: 'calculation', correctAnswer: '1/2', difficulty: 0.5, grade: 6, chapter: '分数乘法' },
      { id: 'q6_2', knowledgePointId: 'kp6_2', content: '1/2 ÷ 1/4 = ?', type: 'calculation', correctAnswer: '2', difficulty: 0.5, grade: 6, chapter: '分数除法' },
      { id: 'q6_3', knowledgePointId: 'kp6_4', content: '一个圆的半径是3cm，周长是（）cm。（π取3.14）', type: 'fill_blank', correctAnswer: '18.84', difficulty: 0.6, grade: 6, chapter: '圆' },
      { id: 'q6_4', knowledgePointId: 'kp6_4', content: '一个圆的半径是3cm，面积是（）平方厘米。（π取3.14）', type: 'fill_blank', correctAnswer: '28.26', difficulty: 0.6, grade: 6, chapter: '圆' },
      { id: 'q6_5', knowledgePointId: 'kp6_5', content: '25%的400是（）。', type: 'fill_blank', correctAnswer: '100', difficulty: 0.4, grade: 6, chapter: '百分数' },
      { id: 'q6_6', knowledgePointId: 'kp6_5', content: '一个数的3/4是60，这个数是（）。', type: 'fill_blank', correctAnswer: '80', difficulty: 0.7, grade: 6, chapter: '分数除法' },
      { id: 'q6_7', knowledgePointId: 'kp6_6', content: '圆柱的底面半径是2cm，高是5cm，体积是（）立方厘米。（π取3.14）', type: 'fill_blank', correctAnswer: '62.8', difficulty: 0.7, grade: 6, chapter: '圆柱与圆锥' },
      { id: 'q6_8', knowledgePointId: 'kp6_3', content: '比值是0.75的最简整数比是（）。', type: 'fill_blank', correctAnswer: '3:4', difficulty: 0.5, grade: 6, chapter: '比' },
      { id: 'q6_9', knowledgePointId: 'kp6_7', content: '比例的基本性质：在比例里，两个外项的积等于两个（）的积。', type: 'fill_blank', correctAnswer: '内项', difficulty: 0.4, grade: 6, chapter: '比例' },
      { id: 'q6_10', knowledgePointId: 'kp6_8', content: '把红、黄、蓝三种颜色的球各10个放在一个袋子里。至少取（）个球，可以保证取到两个颜色相同的球。', type: 'fill_blank', correctAnswer: '4', difficulty: 0.8, grade: 6, chapter: '数学广角' },
    ];
    questions.forEach(q => DB.saveQuestion(q));
  }
  if (DB._getArr('shopItems').length === 0) {
    const items = [
      { id: 'shop_1', name: '学霸勋章', description: '虚拟勋章', icon_url: '🏅', cost: 50 },
      { id: 'shop_2', name: '学习证书', description: '官方学习成就证书', icon_url: '📜', cost: 100 },
      { id: 'shop_3', name: '超级英雄徽章', description: '限量徽章', icon_url: '🦸', cost: 200 },
      { id: 'shop_4', name: '数学之星称号', description: '解锁专属称号', icon_url: '⭐', cost: 150 },
      { id: 'shop_5', name: '难题挑战券', description: '挑战更高难度', icon_url: '🎫', cost: 30 },
    ];
    items.forEach(item => {
      if (!DB._getArr('shopItems').find(i => i.id === item.id)) DB._setArr('shopItems', [...DB._getArr('shopItems'), item]);
    });
  }
  console.log('数据初始化完成');
}
seedData();
