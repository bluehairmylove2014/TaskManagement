
-- 1. Xóa bảng nếu tồn tại
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS Tasks;

-- 2. Tạo bảng
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  -- Thêm các thuộc tính khác tùy ý
  full_name VARCHAR(255),
  age INTEGER
);

CREATE TABLE Tasks (
  id VARCHAR(10) PRIMARY KEY,
  uid INTEGER,
  status VARCHAR(10),
  tags JSONB,
  task_name VARCHAR(255),
  description TEXT,
  due_date VARCHAR(30),
  priority VARCHAR(20)
);

-- 3. Thêm các giá trị mẫu vào bảng
INSERT INTO accounts (email, password, full_name, age)
VALUES
  ('example1@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'John Doe', 30),
  ('example2@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'Jane Smith', 25);


INSERT INTO Tasks (id, uid, status, tags, task_name, description, due_date, priority)
VALUES
  ('task@1', 1, 'Backlog', '[{"tag_name": "Research", "background_color": "orange"}]', 'Auditing information architecture', 'Create content for peceland App', 'May 30, 2023, 6:31 PM', 'Negligible'),
  ('task@2', 1, 'To Do', '[{"tag_name": "Development", "background_color": "blue"}]', 'Implement login functionality', 'Add login feature to peceland App', 'May 25, 2023, 1:31 PM', 'Minor');

