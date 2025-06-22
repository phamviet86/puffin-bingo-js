---
mode: "edit"
description: "Tạo file route API hoàn chỉnh cho service với các thao tác CRUD dựa trên định nghĩa bảng SQL."
---

## Yêu cầu

- Tạo 2 file route API:
  - `route.js` trong thư mục `/src/app/(back)/api/{tableName}` cho các thao tác lấy danh sách/tạo mới (GET/POST)
  - `[id]/route.js` trong thư mục `/src/app/(back)/api/{tableName}/[id]` cho các thao tác chi tiết/cập nhật/xóa (GET/PUT/DELETE)
- **Bắt buộc**: Thêm comment đường dẫn ở đầu mỗi file:
  - `// path: @/app/(back)/api/{tableName}/route.js`
  - `// path: @/app/(back)/api/{tableName}/[id]/route.js`
- Export các handler:
  - GET: Lấy tất cả bản ghi (route.js) hoặc 1 bản ghi theo id ([id]/route.js)
  - POST: Tạo mới bản ghi - chỉ ở route.js
  - PUT: Cập nhật bản ghi theo id - chỉ ở [id]/route.js
  - DELETE: Xóa mềm bản ghi theo id - chỉ ở [id]/route.js

## 1. Import Requirements

- Import các hàm từ file service tương ứng
- Import `buildApiResponse`, `handleData` từ response utility
- Pattern import service: `import { get{TableNames}, get{TableName}, create{TableName}, update{TableName}, delete{TableName} } from "@/service/{table-name}-service"`

## 2. Response Standards

- Validate input dựa trên các trường NOT NULL trong SQL
- Xử lý lỗi với try/catch
- Trả về mã lỗi phù hợp:
  - 400: Thiếu tham số bắt buộc
  - 404: Không tìm thấy hoặc đã bị xóa
  - 500: Lỗi server hoặc thao tác thất bại
- Thông báo lỗi bằng tiếng Việt

## 3. Parameter Handling

- **Query string**: cho GET danh sách
- **Body**: cho POST/PUT (bao gồm id nếu upsert)
- **context.params**: cho các route [id]

## 4. Service Integration

- Kiểm tra kết quả service:
  - `if (!result || !result.length)` cho getById, create, update, delete
  - `handleData(result)` và destructure `{ data, total }` cho getAll
  - Trả về 404 nếu không tìm thấy
  - Trả về 500 nếu thao tác thất bại

## 5. POST Logic (Create Only)

- Chỉ cho phép tạo mới bản ghi (không có logic upsert)
- Trả về 201 khi tạo thành công
- Message tiếng Việt phù hợp

## 6. Error Handling

- Try-catch cho tất cả handlers
- Thông báo lỗi trả về bằng tiếng Việt
- Status codes theo chuẩn HTTP

## Ví dụ code mẫu

### Input (SQL Definition)

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

### Output (`route.js`)

```javascript
// path: @/app/(back)/api/options/route.js

import { getOptions, createOption } from "@/service/options-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getOptions(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách tùy chọn thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    const result = await createOption(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```

### Output (`[id]/route.js`)

```javascript
// path: @/app/(back)/api/options/[id]/route.js

import {
  getOption,
  updateOption,
  deleteOption,
} from "@/service/options-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await getOption(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy tùy chọn.");

    return buildApiResponse(200, true, "Lấy thông tin tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const {
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (dựa vào NOT NULL trong SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    const result = await updateOption(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const { id } = await context.params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await deleteOption(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```
