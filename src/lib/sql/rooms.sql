-- table: phòng học

DROP TABLE IF EXISTS rooms CASCADE;
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  room_name VARCHAR(255) NOT NULL,
  room_status_id INTEGER NOT NULL,
  room_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION set_updated_at();