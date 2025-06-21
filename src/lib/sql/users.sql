-- table: người dùng

DROP VIEW IF EXISTS users_view CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_status_id INTEGER NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_phone VARCHAR(255) DEFAULT NULL,
  user_parent_phone VARCHAR(255) DEFAULT NULL,
  user_avatar VARCHAR(512) DEFAULT NULL,
  user_desc VARCHAR(255) DEFAULT NULL,
  user_notes TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE VIEW users_view AS
SELECT 
  u.*,
  unaccent(split_part(u.user_name, ' ', array_length(string_to_array(u.user_name, ' '), 1))) AS user_first_name,
  unaccent(u.user_name) AS user_full_name,
  STRING_AGG(r.role_name, ', ') AS role_names
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.deleted_at IS NULL
LEFT JOIN roles r ON ur.role_id = r.id AND r.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id;