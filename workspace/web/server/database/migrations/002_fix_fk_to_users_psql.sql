-- PostgreSQL 迁移脚本第二部分：修复和补充
-- 使用 plpgsql 函数处理 IF NOT EXISTS 兼容性问题

DO $$
BEGIN
  -- 确保 point_shop_items 表存在（可能已在第一部分创建）
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '\''point_shop_items'\'') THEN
    CREATE TABLE point_shop_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon_url TEXT,
      cost INTEGER NOT NULL,
      stock INTEGER,
      is_virtual INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  END IF;
END $$;