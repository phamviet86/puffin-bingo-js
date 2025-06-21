-- table: phân quyền

DROP TABLE IF EXISTS user_roles CASCADE;
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  user_id UUID NOT NULL,
  role_id UUID NOT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION set_updated_at();