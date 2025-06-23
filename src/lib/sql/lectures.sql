-- table: bài giảng

DROP TABLE IF EXISTS lectures CASCADE;
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  module_id UUID NOT NULL,
  lecture_name VARCHAR(255) NOT NULL,
  lecture_status_id INTEGER NOT NULL,
  lecture_no INTEGER DEFAULT NULL,
  lecture_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON lectures FOR EACH ROW EXECUTE FUNCTION set_updated_at();