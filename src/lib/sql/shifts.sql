-- table: ca học

DROP TABLE IF EXISTS shifts CASCADE;
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  shift_name VARCHAR(255) NOT NULL,
  shift_start_time TIME NOT NULL,
  shift_end_time TIME NOT NULL,
  shift_status_id INTEGER NOT NULL,
  shift_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION set_updated_at();