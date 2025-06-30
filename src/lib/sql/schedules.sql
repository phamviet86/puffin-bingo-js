-- table: lịch học

DROP VIEW IF EXISTS schedules_view CASCADE;
DROP VIEW IF EXISTS schedules_summary CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;

CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  source_id UUID DEFAULT NULL,
  class_id UUID NOT NULL,
  lecture_id UUID DEFAULT NULL,
  shift_id UUID NOT NULL,
  room_id UUID DEFAULT NULL,
  schedule_date TIMESTAMPTZ NOT NULL,
  schedule_status_id INTEGER NOT NULL,
  schedule_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP VIEW IF EXISTS schedules_view CASCADE;
CREATE OR REPLACE VIEW schedules_view AS
SELECT 
  s.*,
  CASE WHEN schedule_status_id = 23 THEN 1 END AS schedule_pending,
  CASE WHEN schedule_status_id = 24 THEN 1 END AS schedule_completed,
  CASE WHEN schedule_status_id = 25 THEN 1 END AS schedule_absent
FROM schedules s;


DROP VIEW IF EXISTS schedules_summary CASCADE;
CREATE OR REPLACE VIEW schedules_summary AS
SELECT 
    class_id,
    COUNT(CASE WHEN schedule_status_id = 23 THEN 1 END) AS pending_count,
    COUNT(CASE WHEN schedule_status_id = 24 THEN 1 END) AS completed_count,
    COUNT(CASE WHEN schedule_status_id = 25 THEN 1 END) AS absent_count,
    COUNT(*) AS total_count
FROM schedules 
GROUP BY class_id;