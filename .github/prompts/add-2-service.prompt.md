---
mode: "agent"
description: "Tạo file service JavaScript hoàn chỉnh với các thao tác CRUD dựa trên định nghĩa bảng SQL, bao gồm phân trang, lọc và xoá mềm."
---

## Yêu cầu

- Tạo file service từ định nghĩa bảng SQL:
  - File: `/src/service/{table-name}-service.js` (kebab-case, vd: `options-service.js`)
  - **Bắt buộc**: Thêm comment đường dẫn ở đầu file: `// path: @/service/{table-name}-service.js`
  - Export đúng 5 hàm CRUD với quy tắc đặt tên:
    - `get{TableNames}`: lấy tất cả (số nhiều)
    - `get{TableName}`: lấy một bản ghi (số ít)
    - `create{TableName}`: tạo mới (số ít)
    - `update{TableName}`: cập nhật (số ít)
    - `delete{TableName}`: xoá mềm (số ít)

## 1. Function Requirements

- **GET All**: Lấy tất cả bản ghi với phân trang, lọc, sắp xếp
- **GET Single**: Lấy một bản ghi theo ID
- **POST**: Tạo bản ghi mới
- **PUT**: Cập nhật bản ghi
- **DELETE**: Xoá mềm bản ghi

## 2. Code Standards

- **Imports**: `neonDB` từ database connection và `parseSearchParams` từ query utility
- **Error Handling**: try-catch với `throw new Error(error.message)`
- **Soft Delete**: điều kiện `deleted_at IS NULL`
- **Security**: chống SQL injection bằng tagged template literals
- **Query Structure**:
  - SELECT: dùng `SELECT *`, thêm `COUNT(*) OVER() AS total` cho getAll
  - INSERT/UPDATE/DELETE: dùng RETURNING \*
  - DELETE: cập nhật `deleted_at = NOW()`
  - ORDER BY mặc định: `ORDER BY created_at` nếu không có orderByClause

## 3. Database Connection Patterns

- **Initialization**: `const sql = neonDB();`
- **Get All**: `sql.query(sqlText, sqlValue)` với template string và mảng giá trị
- **Other functions**: tagged template literals `sql\`query\`` với biến nội suy

## 4. Search Parameters Pattern

- Khai báo: `const ignoredSearchColumns = [];`
- Destructure: `{ whereClause, orderByClause, limitClause, queryValues }`
- Copy values: `const sqlValue = [...queryValues];`

## 5. Naming Conventions

- **Function names**: camelCase bắt đầu bằng động từ
- **Table names**: PascalCase trong tên hàm, số nhiều cho getAll, số ít cho các hàm khác
- **Object keys**: snake_case nếu map với cột DB

## 6. SQL Formatting

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
