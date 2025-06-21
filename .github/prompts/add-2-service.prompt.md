---
mode: "edit"
description: "Tạo file service JavaScript hoàn chỉnh với các thao tác CRUD dựa trên định nghĩa bảng SQL, bao gồm phân trang, lọc và xoá mềm."
---

## Yêu cầu

- Tạo file service từ định nghĩa bảng SQL:

  - Tên file: `{table-name}-service.js` (kebab-case, vd: `options-service.js`) trong thư mục [service](../../src/service)
  - Tên bảng là số nhiều của đối tượng (vd: options)
  - Export đúng 5 hàm CRUD với quy tắc đặt tên:
    - getOptions: lấy tất cả (số nhiều)
    - getOption: lấy một bản ghi (số ít)
    - createOption: tạo mới (số ít)
    - updateOption: cập nhật (số ít)
    - deleteOption: xoá mềm (số ít)

- Mỗi hàm CRUD cần:

  - GET All: Lấy tất cả bản ghi với phân trang, lọc, sắp xếp (getOptions)
  - GET Single: Lấy một bản ghi theo ID (getOption)
  - POST: Tạo bản ghi mới (createOption)
  - PUT: Cập nhật bản ghi (updateOption)
  - DELETE: Xoá mềm bản ghi (deleteOption)

- Quy tắc code:

  - Import từ kết nối database và tiện ích truy vấn
  - Xử lý lỗi với try-catch, throw new Error(error.message)
  - Xoá mềm với điều kiện `deleted_at IS NULL`
  - Chống SQL injection bằng tagged template literals
  - Phân trang, lọc, sắp xếp dùng parseSearchParams
  - Truy vấn SELECT: loại bỏ `created_at`, `deleted_at`, thêm `COUNT(*) OVER() AS total` cho getAll
  - Truy vấn INSERT/UPDATE: dùng RETURNING với các cột nghiệp vụ
  - Truy vấn DELETE: cập nhật `deleted_at = NOW()`
  - ORDER BY mặc định: `ORDER BY created_at` nếu không có orderByClause

- Quy tắc đặt tên và kiểu dữ liệu:

  - Tên hàm: camelCase bắt đầu bằng động từ
  - Tên bảng PascalCase trong tên hàm, số nhiều cho getAll, số ít cho các hàm khác
  - Object key truyền vào: snake_case nếu map với cột DB

- Mẫu kết nối database:

  - Khởi tạo: `const sql = neonDB();`
  - Get All: `sql.query(sqlText, sqlValue)` với template string và mảng giá trị
  - Các hàm khác: tagged template literals `sql\`query\`` với biến nội suy

- Mẫu parseSearchParams:

  - Khai báo `const ignoredSearchColumns = [];`
  - Destructure: `{ whereClause, orderByClause, limitClause, queryValues }`
  - Sao chép queryValues: `const sqlValue = [...queryValues];`

- Format SQL:
  - Thứ tự tham số nhất quán
  - Xuống dòng, thụt lề rõ ràng
  - Luôn kết thúc câu lệnh SQL bằng dấu chấm phẩy

## Ví dụ

### Input (Định nghĩa SQL)

```sql
-- table: tuỳ chọn

DROP TABLE IF EXISTS options CASCADE;
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  option_table VARCHAR(255) NOT NULL,
  option_column VARCHAR(255) NOT NULL,
  option_label VARCHAR(255) NOT NULL,
  option_color VARCHAR(255) DEFAULT NULL,
  option_group VARCHAR(255) DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON options FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Output (`options-service.js`)

```javascript
// path: @/service/options-service.js

import { neonDB } from "@/lib/db/neon-db";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = neonDB();

export async function getOptions(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT *, COUNT(*) OVER() AS total
      FROM options
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY created_at"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getOption(id) {
  try {
    return await sql`
      SELECT *
      FROM options
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createOption(data) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    return await sql`
      INSERT INTO options (
        option_table, option_column, option_label, option_color, option_group
      ) VALUES (
        ${option_table}, ${option_column}, ${option_label}, ${option_color}, ${option_group}
      )
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateOption(data, id) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    return await sql`
      UPDATE options
      SET option_table = ${option_table}, option_column = ${option_column}, option_label = ${option_label}, option_color = ${option_color}, option_group = ${option_group}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteOption(id) {
  try {
    return await sql`
      UPDATE options
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING *;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
```
