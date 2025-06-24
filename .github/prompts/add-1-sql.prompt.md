---
mode: "edit"
description: "Tạo file SQL để định nghĩa bảng dữ liệu mới với các cột và ràng buộc yêu cầu."
---

## Yêu cầu

- Tạo một file SQL mới tên `{tableName}.sql` trong thư mục [sql](../../src/lib/sql)
- Định nghĩa bảng với tên rõ ràng (ví dụ: `shifts`), gồm các cột mặc định: `id`, `created_at`, `updated_at`, `deleted_at`.
- Đặt cột `id` là khoá chính, kiểu UUID, mặc định sử dụng `gen_random_uuid()`.
- Thêm trigger `set_updated_at()` để tự động cập nhật thời gian cho trường `updated_at`.
- Định nghĩa các cột tuỳ chỉnh theo yêu cầu, sử dụng định dạng snake_case cho tất cả tên cột. Khi định nghĩa cột:
  - Chọn kiểu dữ liệu phù hợp cho từng trường.
  - Áp dụng các ràng buộc cần thiết như PRIMARY KEY, NOT NULL.
  - Thiết lập giá trị mặc định nếu cần.
  - Các trường kết thúc bằng `_status_id` dùng kiểu INTEGER.
  - Các trường kết thúc bằng `_id` dùng kiểu UUID.
  - Đảm bảo mỗi cột đều có ràng buộc (constraint) và giá trị mặc định (default value) phù hợp.

## Ví dụ

### Input

```text
Table: shifts - ca học
Columns:
- shift_name varchar not null
- shift_start_time time not null
- shift_end_time time not null
- shift_status_id integer not null
- shift_desc text null
```

### Output

```sql
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
```
