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
    -- 1. Nhập sai ngày
    WHEN enrollment_end_date IS NOT NULL AND enrollment_start_date > enrollment_end_date THEN 'Nhập sai ngày'
    
    -- 2. Chưa xếp lớp
    WHEN class_id IS NULL THEN 'Chưa xếp lớp'
    
    -- 3. Thiếu ngày bắt đầu (dữ liệu bị mất)
    WHEN enrollment_start_date IS NULL THEN 'Thiếu ngày bắt đầu'
    
    -- 4. Đang hoạt động (đang trong thời gian tham gia)
    WHEN enrollment_start_date <= CURRENT_DATE 
         AND (enrollment_end_date IS NULL OR enrollment_end_date >= CURRENT_DATE) THEN 'Đang hoạt động'
    
    -- 5. Đã nghỉ (đã kết thúc khóa học)
    WHEN enrollment_end_date < CURRENT_DATE THEN 'Đã nghỉ'
    
    -- 6. Chờ bắt đầu (đã xếp lớp nhưng chưa đến ngày bắt đầu)
    ELSE 'Chờ bắt đầu'
  END AS enrollment_status
FROM 
  enrollments;