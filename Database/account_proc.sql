
-- Kiểm tra đăng nhập và trả về account id nếu đúng
CREATE OR REPLACE FUNCTION login(in_email VARCHAR(255), in_password VARCHAR(255))
  RETURNS INTEGER
AS $$
DECLARE
  account_id INTEGER;
BEGIN
  SELECT id INTO account_id FROM accounts ac WHERE ac.email = in_email AND ac.password = in_password;
  RETURN account_id;
END;
$$ LANGUAGE plpgsql;

-- Lấy thông tin account dựa vào email
CREATE OR REPLACE FUNCTION get_account(in_email VARCHAR(255))
  RETURNS TABLE (id INTEGER, email VARCHAR(255), password VARCHAR(255), full_name VARCHAR(255), age INTEGER)
AS $$
BEGIN
  RETURN QUERY SELECT * FROM accounts ac WHERE ac.email = in_email;
END;
$$ LANGUAGE plpgsql;

-- Sửa thông tin account dựa vào email
CREATE OR REPLACE FUNCTION edit_account(in_email VARCHAR(255), new_email VARCHAR(255), new_password VARCHAR(255), new_full_name VARCHAR(255), new_age INTEGER)
  RETURNS VOID
AS $$
BEGIN
  UPDATE accounts ac SET ac.email = new_email, ac.password = new_password, ac.full_name = new_full_name, ac.age = new_age WHERE ac.email = in_email;
END;
$$ LANGUAGE plpgsql;




-- SELECT * from login('example1@example.com', '123456');
SELECT * from get_account('example1@example.com');