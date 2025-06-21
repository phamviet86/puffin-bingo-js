-- table: giáo trình

DROP TABLE IF EXISTS syllabuses CASCADE;
CREATE TABLE syllabuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  syllabus_name VARCHAR(255) NOT NULL,
  syllabus_status_id INTEGER NOT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON syllabuses FOR EACH ROW EXECUTE FUNCTION set_updated_at();