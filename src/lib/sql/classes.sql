-- table: lớp học

DROP VIEW IF EXISTS classes_view CASCADE;
DROP TABLE IF EXISTS classes CASCADE;

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  course_id UUID NOT NULL,
  module_id UUID NOT NULL,
  class_start_date TIMESTAMPTZ DEFAULT NULL,
  class_end_date TIMESTAMPTZ DEFAULT NULL,
  class_fee INTEGER DEFAULT 0,
  class_total_fee INTEGER DEFAULT 0
);

CREATE TRIGGER update_record
BEFORE UPDATE ON classes
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP VIEW IF EXISTS classes_view CASCADE;
CREATE OR REPLACE VIEW classes_view AS
SELECT
  c.*,
  CONCAT(co.course_code, ' - ', m.module_name) AS class_name,
  CONCAT(co.course_name, ' - ', m.module_name) AS class_code,
  CASE
    WHEN c.class_start_date IS NULL AND c.class_end_date IS NULL THEN 'Chưa có lịch'
    WHEN c.class_start_date > c.class_end_date AND c.class_end_date IS NOT NULL THEN 'Nhập sai ngày'
    WHEN c.class_start_date IS NOT NULL AND NOW() < c.class_start_date THEN 'Chờ'
    WHEN c.class_start_date IS NOT NULL AND c.class_end_date IS NULL AND NOW() >= c.class_start_date THEN 'Đang học'
    WHEN c.class_start_date IS NOT NULL AND c.class_end_date IS NOT NULL AND NOW() >= c.class_start_date AND NOW() < c.class_end_date THEN 'Đang học'
    WHEN c.class_end_date IS NOT NULL AND NOW() >= c.class_end_date THEN 'Đã học xong'
    ELSE 'Chưa có lịch'
  END AS class_status
FROM classes c
LEFT JOIN courses co ON c.course_id = co.id
LEFT JOIN modules m ON c.module_id = m.id;