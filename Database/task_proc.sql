-- Xóa các FUNCTION nếu tồn tại
DROP FUNCTION IF EXISTS get_all_tasks();
DROP FUNCTION IF EXISTS edit_task(
	task_id VARCHAR(10), 
	new_status VARCHAR(10), 
	new_tags JSONB,
	new_task_name VARCHAR(255),
	new_description TEXT,
	new_due_date VARCHAR(30), 
	new_priority VARCHAR(20)
);
DROP FUNCTION IF EXISTS delete_task(VARCHAR(10));
DROP FUNCTION IF EXISTS create_task(
  in_user_id INTEGER,
  in_status VARCHAR(10),
  in_tags JSONB,
  in_task_name VARCHAR(255),
  in_description TEXT,
  in_due_date VARCHAR(30),
  in_priority VARCHAR(20)
);
DROP FUNCTION IF EXISTS generate_unique_id();

-- Lấy tất cả các tasks của 1 user
CREATE OR REPLACE FUNCTION get_all_tasks(user_id INTEGER)
  RETURNS TABLE (id VARCHAR(10), uid INTEGER, status VARCHAR(10), tags JSONB, task_name VARCHAR(255), description TEXT, due_date VARCHAR(30), priority VARCHAR(10))
AS $$
BEGIN
  RETURN QUERY SELECT * FROM Tasks t WHERE t.uid = user_id;
END;
$$ LANGUAGE plpgsql;

-- Lấy tất cả các tasks của 1 user dựa vào task_name
CREATE OR REPLACE FUNCTION get_tasks_by_uid_and_name(p_uid INTEGER, p_task_name VARCHAR(255))
  RETURNS TABLE (
    id VARCHAR(10),
    uid INTEGER,
    status VARCHAR(10),
    tags JSONB,
    task_name VARCHAR(255),
    description TEXT,
    due_date VARCHAR(30),
    priority VARCHAR(20)
  )
AS $$
BEGIN
  RETURN QUERY
    SELECT ta.id, ta.uid, ta.status, ta.tags, ta.task_name, ta.description, ta.due_date, ta.priority
    FROM Tasks ta
    WHERE ta.uid = p_uid AND ta.task_name ILIKE '%' || p_task_name || '%';
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_tasks_by_uid_and_name(1, 'a');



-- Edit một task dựa vào task id
CREATE OR REPLACE FUNCTION edit_task(
	task_id VARCHAR(10), 
	new_status VARCHAR(10), 
	new_tags JSONB,
	new_task_name VARCHAR(255),
	new_description TEXT,
	new_due_date VARCHAR(30), 
	new_priority VARCHAR(20)
)
  RETURNS VOID
AS $$
BEGIN
  UPDATE Tasks
  SET 
	  status = new_status,
	  tags = new_tags,
	  task_name = new_task_name,
	  description = new_description,
	  due_date = new_due_date,
	  priority = new_priority
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- Xóa một task dựa vào task id
CREATE OR REPLACE FUNCTION delete_task(task_id VARCHAR(10))
  RETURNS VOID
AS $$
BEGIN
  DELETE FROM Tasks WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- Hàm để tạo ra task_id
CREATE FUNCTION generate_unique_id()
  RETURNS VARCHAR(10) AS
$$
DECLARE
  task_count INTEGER;
  task_id VARCHAR(10);
BEGIN
  SELECT COUNT(*) INTO task_count FROM Tasks;
  task_id := 'task@' || (task_count + 1);
  RETURN task_id;
END;
$$
LANGUAGE plpgsql;

-- Procedure để thêm task mới vào bảng Tasks
CREATE FUNCTION create_task(
  in_user_id INTEGER,
  in_status VARCHAR(10),
  in_tags JSONB,
  in_task_name VARCHAR(255),
  in_description TEXT,
  in_due_date VARCHAR(30),
  in_priority VARCHAR(20)
)
RETURNS VOID
AS $$
DECLARE
  task_id VARCHAR(10);
BEGIN
  task_id := generate_unique_id();
  INSERT INTO Tasks (id, uid, status, tags, task_name, description, due_date, priority)
  VALUES (task_id, in_user_id, in_status, in_tags, in_task_name, in_description, in_due_date, in_priority);
END;
$$
LANGUAGE plpgsql;




-- Lấy tất cả các tasks
SELECT * FROM get_all_tasks(1);

-- -- Edit một task dựa vào task id
-- SELECT edit_task('task@1', 'Process', '[{"tag_name": "Research", "background_color": "red"}]', 'Oh hello', 'Create content for peceland App', 'May 30, 2023, 6:31 PM', 'Negligible');

-- -- Xóa một task dựa vào task id
-- SELECT delete_task('task@2');
