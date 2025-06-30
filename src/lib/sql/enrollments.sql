-- table: đăng ký
-- có sử dụng enrollment_type_id = 20 (học viên) và enrollment_type_id khác 20 (giáo viên, trợ giảng)
-- có sử dụng trường enrollment_payment_type_id = 22 (hàng tháng)

DROP VIEW IF EXISTS enrollments_view CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  user_id UUID NOT NULL,
  module_id UUID DEFAULT NULL,
  class_id UUID DEFAULT NULL,
  enrollment_type_id INTEGER NOT NULL,
  enrollment_payment_type_id INTEGER DEFAULT 22,
  enrollment_payment_amount INTEGER DEFAULT 0,
  enrollment_payment_discount INTEGER DEFAULT 0,
  enrollment_start_date TIMESTAMPTZ DEFAULT NULL,
  enrollment_end_date TIMESTAMPTZ DEFAULT NULL,
  enrollment_discount_notes VARCHAR(512) DEFAULT NULL, 
  enrollment_desc TEXT DEFAULT NULL
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
    
    -- 2. Đã kết thúc (có thể thôi học hoặc thôi không chờ lớp)
    WHEN enrollment_end_date < CURRENT_DATE THEN 'Đã kết thúc'

    -- 3. Chờ xếp lớp
    WHEN class_id IS NULL THEN 'Chờ xếp lớp'
    
    -- 4. Thiếu ngày bắt đầu (dữ liệu bị mất)
    WHEN enrollment_start_date IS NULL THEN 'Thiếu ngày'
    
    -- 4. Đang hoạt động (đang trong thời gian tham gia)
    WHEN enrollment_start_date <= CURRENT_DATE 
         AND (enrollment_end_date IS NULL OR enrollment_end_date >= CURRENT_DATE) 
         AND enrollment_type_id = 20 THEN 'Đang học'
    
    -- 5. Đang dạy (đang trong thời gian tham gia với enrollment_type_id khác 20)
    WHEN enrollment_start_date <= CURRENT_DATE 
         AND (enrollment_end_date IS NULL OR enrollment_end_date >= CURRENT_DATE) 
         AND enrollment_type_id != 20 THEN 'Đang dạy'
    
    
    -- 7. Chờ bắt đầu (đã xếp lớp nhưng chưa đến ngày bắt đầu)
    ELSE 'Đã xếp lớp'
  END AS enrollment_status
FROM 
  enrollments;