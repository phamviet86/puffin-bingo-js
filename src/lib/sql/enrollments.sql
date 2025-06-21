-- table: đăng ký

DROP VIEW IF EXISTS enrollments_view CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  user_id UUID NOT NULL,
  module_id UUID NOT NULL,
  class_id UUID DEFAULT NULL,
  enrollment_type_id INTEGER NOT NULL,
  enrollment_payment_type_id INTEGER DEFAULT NULL,
  enrollment_payment_amount INTEGER DEFAULT 0,
  enrollment_payment_discount INTEGER DEFAULT 0,
  enrollment_start_date TIMESTAMPTZ DEFAULT CURRENT_DATE,
  enrollment_end_date TIMESTAMPTZ DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP VIEW IF EXISTS enrollments_view CASCADE;
CREATE OR REPLACE VIEW enrollments_view AS
SELECT 
  *,
  CASE
    WHEN enrollment_end_date IS NOT NULL AND enrollment_start_date > enrollment_end_date THEN 'Nhập sai ngày'
    WHEN class_id IS NULL THEN 'Chưa xếp lớp'
    WHEN enrollment_end_date IS NULL OR enrollment_end_date >= CURRENT_DATE THEN 'Đã xếp lớp'
    ELSE 'Đã nghỉ'
  END AS enrollment_status
FROM 
  enrollments;