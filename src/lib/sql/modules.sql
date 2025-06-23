-- table: học phần

DROP TABLE IF EXISTS modules CASCADE;
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  syllabus_id UUID NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  module_status_id INTEGER NOT NULL,
  module_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION set_updated_at();