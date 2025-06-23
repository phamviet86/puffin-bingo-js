-- table: vai trò

DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  role_name VARCHAR(255) NOT NULL,
  role_path VARCHAR(255) NOT NULL,
  role_status_id INTEGER NOT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();